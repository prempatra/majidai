// make methods accessible from user
module.exports = function (sessObj, logger, reqResp) {
    let obj = Object.create(null);
    
    // add logger
    obj.logger = logger;

    Object.defineProperty(obj, "data", {
        value: (function () {
            var getData, postData;
            return {
                setGetParam: dt => getData = dt,
                setPostParam: dt => postData = dt,
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
            static: filePath => reqResp.sendStaticResponse(filePath),
            error: (errCode, msg = "") => reqResp.respondErr(errCode, msg),
            plainText: content => reqResp.sendResp("text/plain", content),
            html: content => reqResp.sendResp("text/html", content),
            json: content => reqResp.sendJsonResponse(content),
            redirect: url => reqResp.redirectUrl(url),
        }
    });


    // add session functions for user
    if (sessObj.config.isActivate) {
        obj.cookieId = "";
        Object.defineProperty(obj, "session", {
            value: {
                put: (k, v) => sessObj.put(obj.cookieId, k, v),
                delete: k => sessObj.delete(obj.cookieId, k),
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
                destroy: () => sessObj.destroy(obj.cookieId)
            }
        });


        Object.defineProperty(obj, "triggerAuthCheck", {
            value: function (url) {
                obj.cookieId = sessObj.regenId(obj.cookieId);
                reqResp.setCookie(sessObj.vars.sessionId, obj.cookieId);
                return sessObj.put(obj.cookieId, sessObj.vars.isUserLogged, 1);
            }
        });
        Object.defineProperty(obj, "mustBeAuthorized", {
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

                obj.logger.error("parameter for mustBeAuthorized is invalid", true);
                return reqResp.respondErr(401);
            }
        });
    }

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
                // if (reqResp.request.headers.hasOwnProperty(key)) return reqResp.request.headers[key];
                if (key in reqResp.request.headers) return reqResp.request.headers[key];
                return "";
            },
            addCookie: (...args) => {
                var key, val, domain, path, expireDate, httpOnly, secure;
                if (args.length === 1 && typeof args[0] == "object") {
                    if (args[0].hasOwnProperty("key") && args[0].hasOwnProperty("value")) {
                        reqResp.addCookie(args[0]);
                        return true;
                    }

                } else if (args.length === 2 && typeof args[0] == "string" && typeof args[1] == "string") {
                    reqResp.addCookie({
                        key: args[0],
                        value: args[1]
                    });
                    return true;
                }

                return false
            },
            deleteCookie: k => reqResp.deleteCookie(k)
        }
    });
    return obj;
}