const http = require("http");
const fs = require("fs");
const path = require('path');
const querystring = require('querystring');
const Krequest = require("./krequest");
const Ksess = require('./ksession');
const Klog = require('./klog');
const userMethod = require("./user");
const config = require("./config");
const validate = require("./validate");
const initCookie = require("./init_cookie");
const MSG = require("./constants").MSG;

class Khttp {
    constructor(...args) {
        this._config = new config();
        this._getRouting = new Map();
        this._postRouting = new Map();
        this._rootDir = path.dirname(process.argv[1]);
        var userConfig = args.length > 0 && typeof args[0] === "object" && args[0];
        if (userConfig) this._config.applyUserConfig(userConfig);
        this._session = new Ksess(this._config.sessionTime);
        this._logger = new Klog(this._config["log"], this._config.isProduction);
        this._reqResp = new Krequest();
        this.userObj = userMethod(this._session, this._logger, this._reqResp);
    }

    _validateRouting(args) {
        if (args == undefined || typeof args != "object") {
            throw new TypeError(MSG.ERR_INVALID_ROUTING);
        }
        if (args.length < 2) {
            throw new TypeError(MSG.ERR_INVALID_ROUTING);
        }
        if (typeof args[0] != "string" || typeof args[1] != "function") {
            throw new TypeError(MSG.ERR_INVALID_ROUTING);
        }

        if(!(/^[a-zA-Z0-9-_{}/]+$/.test(args[0]))){
            throw new TypeError(MSG.ERR_NOT_VALID_ROUTING);
        }
    }

    get(...args) {
        this._validateRouting(args);

        var urlStr = args[0];
		urlStr.length > 1 && urlStr[urlStr.length-1] == "/" && (urlStr = urlStr.substring(0,urlStr.length-1));
        if(this._getRouting.has(urlStr)){
            throw new TypeError(MSG.ERR_ROUTING_DEFINED_MULTIPLE);
        }

        var params=[];
        var s = urlStr.match(/{[^}]*}/g);
        var route = s ? urlStr.substr(0,urlStr.indexOf(s[0])-1) : urlStr;
        if(s) s.forEach(itm => params.push(itm.replace(/[{|}]/g,"")));
        this._getRouting.set(route, {next:args[1],params:params});
    }


    post(...args) {
        this._validateRouting(args);
        if(this._postRouting.has(args[0])){
            throw new TypeError(MSG.ERR_ROUTING_DEFINED_MULTIPLE);
        }

        this._postRouting.set(args[0], args[1]);
    }

    start() {
        try {
            let userObj = this.userObj;
            process.on('uncaughtException', function (err) {
                try {
                    // send internal server error
                    userObj.logger.error(err.message, true);
                    return userObj.respond.error(500);
                } catch (err) {
                    console.error(err);
                }
            });

            this._server = http.createServer((req, resp) => this.handle(req, resp));
            this._server.listen(this._config.port, this._config.host);
            this._logger.debug(`Server Listening at http://${this._config.host}:${this._config.port}`);
            // remove timeout session data every hour
            setInterval(() => {
                try {
                    this._session.validateAll();
                } catch (error) {
                    // do nothing
                }
            }, 1000*60*60);
        } catch (err) {
            throw err;
        }
    }

    stop() {
        this._server.close();
        this._logger.debug("Server Stopped Listening.");
        process.exit(0);
    }

    isSecure(filePath) {
        // allow only files
        if (!fs.statSync(filePath).isFile()) return false;

        // do not allow other then public directory
        if (filePath.indexOf(path.resolve(this._config.publicDir)) !== 0) return false;

        // do not allow symbolic link
        if (fs.statSync(filePath).isSymbolicLink()) return false;

        // do not allow to access to js files on same directory level of server.js
        if (path.dirname(filePath) == path.dirname(process.argv[1])) {
            if (path.extname(filePath).toLowerCase() == ".js") {
                return false;
            }
        }

        return true;
    }

    handle(req, resp, config) {
        try {
            this._reqResp.setRequest(req);
            this._reqResp.setResponse(resp);
            this._reqResp.setHeader(this._config.header);
            req = resp = null;

            // write access log
            this._logger.access(this.userObj.logger.getPrefix());
            
            // error handling
            var isValidRequest = validate(this.userObj, this._config);
            if (!isValidRequest) return;

            // read cookie from request
            this.userObj.cookieId = initCookie(this._reqResp,this._session);

            // used accessing route
            let homePath = this._reqResp.homePath();

            let userObj = this.userObj;
            let reqObj = this._reqResp.request;
            // send response
            var sendResponse = function(respData){
                // if user sends custom rsponse then he should return undefined
               if (respData == undefined) return;
               // send response as plain string
               if (typeof respData == "string") return userObj.respond.plainText(respData);
               // send response as json
               return userObj.respond.json(respData);
            }
            // send response for GET
            if (this._reqResp.request.method == "GET") {
                // respond to static files
                let reqPage = path.join(this._rootDir, this._config.publicDir, homePath);
                if (fs.existsSync(reqPage) && this.isSecure(reqPage)) {
                    return this._reqResp.sendStaticResponse(reqPage);
                }
                // respond to normal request
                if (this._getRouting.get(homePath)) {
                    // set get data
                    userObj.data.setGetParam(this._reqResp.getParamAll());
                    // run the function defined by user
                    let respData = this._getRouting.get(homePath).next(this.userObj);
                    // respond
                    return sendResponse(respData);
                }

                // respond to /{key1}/{key2} format
                for (const [key, value] of this._getRouting) {       
                    if(homePath.startsWith(key+"/") && value.params.length > 0) {
                        var getData = this._reqResp.getParamAll();
                        var urlParam = homePath.substr(key.length);
                        var k = []
                        urlParam.split("/").forEach(itm => itm && k.push(itm));
                        k.forEach((val,i) => {
                            if(i < value.params.length){
                                getData[value.params[i]] = val;
                            }
                        });

                        // set get data
                        userObj.data.setGetParam(getData);
                        // run the function defined by user
                        let respData = this._getRouting.get(key).next(this.userObj);
                        // respond
                        return sendResponse(respData);
                    }
                }
                
                // return file not found
                this._reqResp.respondErr(404);
            }

            // send response for POST
            else if (this._reqResp.request.method == "POST") {
                // send not found
                if (!this._postRouting.has(homePath)) {
                    return this._reqResp.respondErr(404);
                }

                let data = "";
                let postRouting=this._postRouting;

                // multipart form data
                if(this._reqResp.request.headers["content-type"].includes("multipart/form-data")){
                    let respData = postRouting.get(homePath)(userObj);
                    return sendResponse(respData);
                }

                // for json/application & www_url_encoded
                this._reqResp.request.on('data', function (chunk) {
                    data += chunk;
                });
                this._reqResp.request.on('end', () => {
                    try {
                        // get user data
                        let parsedData = function formatData(headers, data){
                            if(headers["content-type"].includes("application/json")){
                                try {
                                    return JSON.parse(data);
                                } catch (error) {
                                    // do nothing
                                }
                            }
                            return querystring.parse(data);
                        }(reqObj.headers,data);

                        userObj.data.setPostParam(parsedData);
                        // run the function defined by user
                        let respData = postRouting.get(homePath)(userObj);
                        return sendResponse(respData);
                    } catch (err) {
                        userObj.logger.error(err.stack || err.message,true);
                        userObj.respond.error(500);
                    }
                   
                });   
            }

        } catch (err) {
            // send internal server error
            this.userObj.logger.error(err.stack || err.message,true);
            return this._reqResp.respondErr(500);
        }

    }
};

module.exports = Khttp;