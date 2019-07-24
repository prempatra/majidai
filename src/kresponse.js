const fs = require("fs");
const path = require('path');
const CONTENT_TYPE = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".ico": "image/x-icon",
    ".pdf": "application/pdf"
};
const BINARY_RESP = [".jpg", ".jpeg", ".png", ".gif", ".ico", ".pdf"];
Date.prototype.addYears = function(n) {
    var now = new Date();
    return new Date(now.setFullYear(now.getFullYear() + n));
};

/**
 * This class controls the response.
 * 
 * TODO
 * 1. increase error code
 */
class Kresponse {

    setResponse(response){
        // http response object
        this.response = response;
    }

    /**
     * set the header for response
     * 
     * @param {object} hdrObj - {key:value,key:value}
     */
    setHeader(hdrObj) {
        Object.keys(hdrObj).forEach(key => {
            this.response.setHeader(key, hdrObj[key]);
        });
    }

     /**
     * set cookie in the response
     * @param {string} key - cookie name
     * @param {string} value - cookie value
     */
    setCookie(key, value) {
        this.response.setHeader('Set-Cookie', [`${key}=${value}; HttpOnly; Path=/; expires=${new Date().addYears(1)}`]);
    }

    addCookie(dt) {
        var newCookie = `${dt.key}=${dt.value};` +
            (dt.hasOwnProperty("httpOnly") && dt.httpOnly ? " HttpOnly;" : "") +
            (dt.hasOwnProperty("secure") && dt.secure ? " Secure;" : "") +
            (dt.hasOwnProperty("path") ? ` Path=${dt.path};` : "") +
            (dt.hasOwnProperty("domain") ? ` Domain=${dt.domain};` : "") +
            (dt.hasOwnProperty("expireDate") ? ` Expires=${dt.expireDate};` : "");
        this.response.getHeader("Set-Cookie") || this.response.setHeader('Set-Cookie',[]);
        this.response.getHeader("Set-Cookie").push(newCookie);
    }
     /**
     * deletes the cookie from response
     * @param {string} key - name of the cookie
     */
    deleteCookie(key) {
        this.response.setHeader('Set-Cookie', [`${key}=; expires=${new Date(0)}`]);
    }


    /**
     * redirect to given url
     * 
     * @param {string} urlStr - url to redirect
     */
    redirectUrl(urlStr) {
        if (this.isHeadersSent()) return;
        
        this.response.writeHead(303, {
            Location: urlStr
        });
        this.response.end();
    }

    /**
     * send jsonresponse
     * @param {JSON string} content 
     * @param {integer} statusCode 
     */
    sendJsonResponse(content, statusCode = 200) {
        this.sendResp("application/json", JSON.stringify(content), statusCode);
    }

    sendResp(contentType, content, statusCode = 200) {
        if (this.isHeadersSent()) return;

        this.response.statusCode = statusCode;
        this.response.setHeader("Content-Type", `${contentType}; charset=utf-8`);
        this.response.write(content);
        this.response.end();
    }

    /**
     * send response for static files like html,css,js,images
     * 
     * @param {*} resp 
     * @param {*} filePath 
     */
    sendStaticResponse(filePath) {
        try {
            if (this.isHeadersSent()) return;
            if (fs.existsSync(filePath)) {
                if (!fs.statSync(filePath).isSymbolicLink() && fs.statSync(filePath).isFile()) {
                    let ext = path.extname(filePath).toLocaleLowerCase();
                    let allowedExt = Object.keys(CONTENT_TYPE);
                    if (allowedExt.includes(ext)) {
                        let contType = CONTENT_TYPE[ext];
                        this.response.statusCode = 200;
                        this.response.setHeader("Content-Type", `${contType}; charset=utf-8`);
                        // if images are passed with second parameter as encoding then browser wont display them properly
                        if (BINARY_RESP.includes(ext)) {
                            fs.createReadStream(filePath).pipe(this.response);
                        } else {
                            fs.createReadStream(filePath, "utf-8").pipe(this.response);
                        }
                        return;
                    }
                }
            }
        } catch (error) {

        }

        this.respondErr(404);
    }

    respondErr(...args) {
        if (args.length < 1) return;
        if (typeof args[0] != 'number') return;
        var contentType = args.length == 3 && typeof args[2] == "string" ? args[2] : "text/plain";
        var msg = args[1] || (function (errCode) {
            if (errCode == 400) return "Bad Request.";
            if (errCode == 401) return "Unauthorized Access.";
            if (errCode == 403) return "Request Forbidden.";
            if (errCode == 404) return "Not Found.";
            if (errCode == 405) return "Method Not Allowed.";
            if (errCode == 413) return "Payload Too Large.";
            if (errCode == 500) return "Internal Server Error.";
            return "Woops! Something went wrong.";
        })(args[0]);

        this.sendResp(contentType, msg, args[0]);
    }

    isHeadersSent() {
        return this.response.headersSent;
    }
}

module.exports = Kresponse;