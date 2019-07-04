module.exports = function (reqResp, sessObj) {
    let id = reqResp.getCookie(sessObj.vars.sessionId);
    // if no cookie found, create
    if (id == "") {
        // save id to session
        id = sessObj.genId();
        // write cookie in response
        reqResp.setCookie(sessObj.vars.sessionId, id);
    } else {
        // if cookie found in request but not in session
        if (Object.keys(sessObj.getAll(id)).length === 0) {
            // add the cookie id to session
            sessObj.createUser(id);
        } else {
            // if cookie in session is timeouted then recreate it
            sessObj.validateUser(id);
        }   
    }

    return id;
}