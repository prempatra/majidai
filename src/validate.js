const MSG = require("./constants").MSG;

module.exports = function (userObj, config) {
    // init user data
    userObj.data.setGetParam({});
    userObj.data.setPostParam({});

    // on error event while serving REQUEST
    userObj.native.request().on("error", (err) => {
        throw Error(err);
    });
    // on error event while serving RESPONSE
    userObj.native.response().on("error", (err) => {
        throw Error(err);
    });

    // respond not supported http method
    if (!config.allowedMthod.includes(userObj.client.method())) {
        return userObj.respond.error(405);
    }
    // response to body size exceeding then of setting size
    if (userObj.client.headers("content-length") > config.maxBodySize) {
        return userObj.respond.error(413);
    }

    if (userObj.client.method() == "POST") {
        var contentType = userObj.client.headers("content-type").split(";")[0].trim();
        if (!config.allowedContentType.includes(contentType)) {
            return userObj.respond.error(400,MSG.ERR_NOT_SUPPORTED_CONTENT_TYPE);
        }
    }

    return true;
}