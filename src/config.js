const MSG = require("./constants").MSG;

module.exports = class Config{
    // default server settings
    constructor() {
        this.port = 80;
        this.host = "0.0.0.0";
        this.log = {
            folder: "./log",
            access: false,
            debug: false,
            error: true
        };
        this.publicDir = "./public";
        this.isProduction = true;
        // miliseconds
        this.sessionTime = 1000 * 60 * 5;
        // byte
        this.maxBodySize = 100 * 1024;
        this.header = {
            "x-content-type-options": "nosniff",
            "x-frame-options": "SAMEORIGIN",
            "x-xss-protection": "1; mode=block",
            "server": "majidai@1.0",
            "Access-Control-Allow-Origin":"*",
        };
        this.allowedMthod = ["GET","POST"]
        this.allowedContentType = ["application/x-www-form-urlencoded", "application/json", "multipart/form-data"]
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

        if (userConfig.hasOwnProperty("sessionTime")) {
            if (typeof userConfig.sessionTime !== "number") {
                throw new TypeError(MSG.ERR_INVALID_DATA_TYPE_SESSION_TIME);
            }
            if (userConfig.sessionTime < 1) {
                throw new TypeError(MSG.ERR_INVALID_SESSION_TIME);
            }
            this.sessionTime = userConfig.sessionTime;
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
        }

        if (userConfig.hasOwnProperty("header")) {
            this._validateObject(this.header, userConfig["header"]);
            for (const key in this.header) {
                if (Object.keys(userConfig["header"]).includes(key)) continue;
                userConfig["header"][key] = this.header[key];
            }
            this.header = userConfig.header;
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