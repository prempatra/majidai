const fs = require('fs');
const MSG = require("./constants").MSG;

module.exports = class Config{
    // default server settings
    constructor() {
        this.port = 80;
        this.host = "0.0.0.0";
        this.publicDir = "./public";
        this.isProduction = true;

        // byte
        this.maxBodySize = 100 * 1024;
        this.header = {
            "x-content-type-options": "nosniff",
            "x-frame-options": "SAMEORIGIN",
            "x-xss-protection": "1; mode=block",
            "server": "majidai@1.0",
            "Access-Control-Allow-Origin":"*",
        };
        this.allowedMthod = ["GET", "POST"];
        this.allowedContentType = ["application/x-www-form-urlencoded", "application/json", "multipart/form-data"];

        this.session = {
            isActivate: true,
            timeOut: 1000 * 60 * 5, // miliseconds
        };

        this.log = {
            folder: "./log",
            isWriteAccess: false,
            isProd: this.isProduction,
        };

        this.ssl = {
            key: 'ssl/key.pem',
            cert: 'ssl/cert.pem',
            port: 443,
            isActivate: false,
            http: true,
            http2: false,
        }
    }

    // apply user configuration
    applyUserConfig(userConfig) {
        if (userConfig.hasOwnProperty("port")) {
            if (typeof userConfig.port !== "number") {
                throw new TypeError(MSG.ERR_INVALID_DATA_TYPE_PORT);
            }
            this.port = userConfig.port;
        }

        if (userConfig.hasOwnProperty("host")) {
            if (typeof userConfig.host !== "string") {
                throw new TypeError(MSG.ERR_INVALID_DATA_TYPE_HOST);
            }
            this.host = userConfig.host;
        }

        if (userConfig.hasOwnProperty("publicDir")) {
            if (typeof userConfig.publicDir !== "string") {
                throw new TypeError(MSG.ERR_INVALID_DATA_TYPE_PUBLIC_DIR);
            }
            // do not allow the root directory as public directory
            if (path.resolve(userConfig["publicDir"]) == this._rootDir) {
                throw new TypeError(MSG.ERR_INVALID_PUBLIC_DIR);
            }
            this.publicDir = userConfig.publicDir;
        }

        if (userConfig.hasOwnProperty("isProduction")) {
            if (typeof userConfig.isProduction !== "boolean") {
                throw new TypeError(MSG.ERR_INVALID_DATA_TYPE_IS_PRODUCTION);
            }
            this.isProduction = userConfig.isProduction;
        }

        if (userConfig.hasOwnProperty("session")) {
            this._validateObject(this.session, userConfig["session"]);
            for (const key in this.session) {
                if (Object.keys(userConfig["session"]).includes(key)) continue;
                userConfig["session"][key] = this.session[key];
            }
            this.session = userConfig.session;

            if (typeof this.session.timeOut !== "number") {
                throw new TypeError(MSG.ERR_INVALID_DATA_TYPE_SESSION_TIME);
            }
            if (this.session.timeOut < 1) {
                throw new TypeError(MSG.ERR_INVALID_SESSION_TIME);
            }
            if (typeof this.session.isActivate !== "boolean") {
                throw new TypeError(MSG.ERR_INVALID_DATA_TYPE_SESSION_ACTIVATION);
            }
        }

        if (userConfig.hasOwnProperty("maxBodySize")) {
            if (typeof userConfig.maxBodySize !== "number") {
                throw new TypeError(MSG.ERR_INVALID_DATA_TYPE_MAX_BODY_SIZE);
            }
            if (userConfig.maxBodySize < 1) {
                throw new TypeError(MSG.ERR_INVALID_MAX_BODY_SIZE);
            }
            this.maxBodySize = userConfig.maxBodySize;
        }

        
        if (userConfig.hasOwnProperty("log")) {
            this._validateObject(this.log, userConfig["log"]);
            for (const key in this.log) {
                if (Object.keys(userConfig["log"]).includes(key)) continue;
                userConfig["log"][key] = this.log[key];
            }
            this.log = userConfig.log;
            this.log["isProd"] = this.isProduction;
        }

        if (userConfig.hasOwnProperty("header")) {
            this._validateObject(this.header, userConfig["header"]);
            for (const key in this.header) {
                if (Object.keys(userConfig["header"]).includes(key)) continue;
                userConfig["header"][key] = this.header[key];
            }
            this.header = userConfig.header;
        }

        if (userConfig.hasOwnProperty("ssl")) {
            this._validateObject(this.ssl, userConfig["ssl"]);

            // todo 
            // check ssl files existence
            this.ssl.key = fs.readFileSync(userConfig["ssl"]["key"]);
            this.ssl.cert = fs.readFileSync(userConfig["ssl"]["cert"]);
            this.ssl.port = userConfig["ssl"]["port"];

            if ("http" in userConfig["ssl"]) {
                if (typeof userConfig["ssl"]["http"] == "boolean") this.ssl.http = userConfig["ssl"]["http"];
            }

            if ("http2" in userConfig["ssl"]) {
                if (typeof userConfig["ssl"]["http2"] == "boolean") this.ssl.http2 = userConfig["ssl"]["http2"];
            }

            this.ssl.isActivate = true;
        }

    }

    _validateObject(thisObj, paramObj) {
        if (paramObj == undefined || typeof paramObj != "object") {
            throw new TypeError(MSG.ERR_INVALID_CONFIGURATION);
        }

        for (const key in paramObj) {
            if (paramObj.hasOwnProperty(key) && !thisObj.hasOwnProperty(key)) {
                throw new TypeError(MSG.ERR_INVALID_CONFIGURATION);
            }
        }
    }


}