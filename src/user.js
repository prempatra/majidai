// make methods accessible from user
module.exports = function (sessObj, logger, reqResp) {
    let obj = Object.create(null);
    obj.cookieId = "";
    // add logger
    Object.defineProperty(obj, "logger", {
        value: {
            debug: function (content, isAddPrefix = false) {
                if (!isAddPrefix) return logger.debug(content);
                return logger.debug(this.getPrefix() +  + "," + content);
            },
            error: function (content, isAddPrefix = false) {
                if (!isAddPrefix) return logger.error(content);
                return logger.error(this.getPrefix() +  + "," + content);
            },
            getPrefix: function () {
                return new Date().toLocaleString() + "," +
                    reqResp.ip() + "," +
                    reqResp.hostName() + "," +
                    reqResp.userAgent() + "," +
                    reqResp.method() + "," +
                    reqResp.referrer() + "," +
                    reqResp.url();
            }
        }
    });

    // add session functions for user
    Object.defineProperty(obj, "session", {
        value: {
            put: function (key, value) {
                return sessObj.put(obj.cookieId, key, value);
            },
            delete: function (key) {
                return sessObj.delete(obj.cookieId, key);
            },
            get: function (key) {
                // return sessObj.get(obj.cookieId, key);
                var usrDt = sessObj.getAll(obj.cookieId);
                if (!key) return usrDt;
                if (usrDt.hasOwnProperty(key)) return usrDt[key];
                return "";
            },
            regenId: function () {
                obj.cookieId = sessObj.regenId(obj.cookieId);
                // write cookie in response
                reqResp.setCookie(sessObj.vars.sessionId, obj.cookieId);
            },
            destroy: function (key) {
                return sessObj.destroy(obj.cookieId);
            }
        }
    });

    Object.defineProperty(obj, "data", {
        value: (function () {
            var getData,postData;
            return {
                setGetParam: function (dt) {
                    getData = dt;
                },
                setPostParam: function (dt) {
                    postData = dt;
                },
                getParams: function (key) {
                    if (!key) return getData;
                    if (key in getData) return getData[key];
                    return "";
                },
                postParams: function (key) {
                    if (!key) return postData;
                    if (postData && key in postData) return postData[key];
                    return "";
                },
            }
        })()
    });

    Object.defineProperty(obj, "respond", {
        value: {
            static: function (filePath) {
                return reqResp.sendStaticResponse(filePath);
            },
            error: function (errCode,msg="") {
                return reqResp.respondErr(errCode,msg);
            },
            plainText: function (content) {
                return reqResp.sendResp("text/plain", content);
            },
            html: function (content) {
                return reqResp.sendResp("text/html", content);
            },
            json: function (content) {
                return reqResp.sendJsonResponse(content);
            },
            redirect: function (url) {
                return reqResp.redirectUrl(url);
            }
        }
    });

    Object.defineProperty(obj, "triggerLoginCheck", {
        value: function (url) {
            obj.cookieId = sessObj.regenId(obj.cookieId);
            // write cookie in response
            reqResp.setCookie(sessObj.vars.sessionId, obj.cookieId);
            return sessObj.put(obj.cookieId, sessObj.vars.isUserLogged, 1);
        }
    });
    Object.defineProperty(obj, "mustBeLoggedIn", {
        value: function (param) {
            var isLogged = sessObj.get(obj.cookieId, sessObj.vars.isUserLogged);
            if (isLogged) return true;

            if (!param) return reqResp.respondErr(401);
            if (typeof param === "string") return reqResp.respondErr(401, param);

            if (typeof param === "object") {
                if (param.hasOwnProperty("url")) {
                    return reqResp.redirectUrl(param.url);
                }
            }

            obj.logger.error("parameter for mustBeLoggedIn is invalid",true);
            return reqResp.respondErr(401);
        }
    });

    // node native request and response
    Object.defineProperty(obj, "native", {
        value: {
            request: () => reqResp.request,
            response: () => reqResp.response,
        }
    });

    Object.defineProperty(obj, "client", {
        value: {
            ip: () => reqResp.ip(),
            hostName: () => reqResp.hostName(),
            userAgent: () => reqResp.userAgent(),
            referrer: () => reqResp.referrer(),
            url: () => reqResp.url(),
            getCookie: (key) => {
                var cookie = reqResp.getCookie();
                if (!key) {
                    var dt = {};
                    cookie.forEach((value, key) => dt[key] = value);
                    return dt;
                }
                return cookie.has(key) ? cookie.get(key) : "";
            },
            method: () => reqResp.method(),
            headers: (key) => {
                if (!key) return reqResp.request.headers;
                if (reqResp.request.headers.hasOwnProperty(key)) return reqResp.request.headers[key];
                return "";
            },
            addCookie: (...args) => {
                var key, val, domain, path, expireDate, httpOnly, secure;
                if (args.length === 1 && typeof args[0] == "object") {
                    if (args[0].hasOwnProperty("key") && args[0].hasOwnProperty("value")) {
                        reqResp.addCookie(args[0]);
                        return true;
                    }
                    
                }else if (args.length === 2 && typeof args[0] == "string" && typeof args[1] == "string") {
                    reqResp.addCookie({ key: args[0], value: args[1] });
                    return true;
                }
                
                return false
            }
        }
    });
    return obj;
}