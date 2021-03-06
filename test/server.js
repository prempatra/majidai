// import majidai
const majidai = require("../index");

const config = {
    port: 8000,
    maxBodySize: 10000 * 1024,
    header : {
        "x-content-type-options": "",
        "x-frame-options": "deny",
        "x-xss-protection": "0",
        "server": "majidai@test",
        "Access-Control-Allow-Origin":"*",
    }
};

// create instance
const server = new majidai(config);

// add get routing
server.get("/", function (app) {
    return app.respond.plainText("Welcome to majidai");
});
server.get("/json", function (app) {
    return app.respond.json({ id: 1, name: "user1" });
});
server.get("/html", function (app) {
    return app.respond.html("<h1>Welcome to majidai</h1>");
});
server.get("/static-html", function (app) {
    return app.respond.static("./test/sample.html")
});
server.get("/static-pdf", function (app) {
    return app.respond.static("./test/sample.pdf")
});
server.get("/error", function (app) {
    var getParams = app.data.getParams();
    var errorCode = getParams.code || 500;
    var errMsg = getParams.msg || "woops! something went wrong.";
    return app.respond.error(errorCode, errMsg);
});

// session manipulation and get parameters
server.get("/session/{method}/{key}/{val}", app => {
    var method = app.data.getParams("method");
    var key = app.data.getParams("key");
    var val = app.data.getParams("val");
    app.logger.debug(method + ", " + key + ":" + val);
    var returnData = {};
    switch (method) {
        case "set":
            app.session.put(key, val);
            returnData = app.session.get();
            break;
        case "get":
            returnData = app.session.get(key);
            break;
        case "delete":
            app.session.delete(key);
            returnData = app.session.get();
            break;
        case "destroy":
            app.session.destroy();
            returnData = app.session.get();
            break;
        default:
            break;
    }

    return returnData;
});


// authentication and post routing
server.post("/login", function (app) {
    app.triggerAuthCheck();
    app.session.put("name", "user1");
    return app.data.postParams();
});
server.get("/dashboard", function (app) {
    if (!app.mustBeAuthorized("not logged user")) return;
    return app.session.get();
});



// cookie manipulation
server.get("/cookie/{key}/{value}", function (app) {
    var userData = app.data.getParams();
    if (userData.type && userData.type == "delete") {
        app.client.deleteCookie(userData.key);
        return "deleted";
    }

    var cookieData = {
        key: userData.key,
        value: userData.value,
        httpOnly: userData.httpOnly ? true : false,
    };

    if (userData.expireDate) cookieData["expireDate"] = userData.expireDate;
    app.client.addCookie(cookieData);
    
    return app.client.getCookie();
});


server.get("/iframe", function (app) {
    const html = `
    <html>
    <head>
    <title>x-frame-options TEST</title>
    </head>
    <body>
        <iframe src="./" width="100%" height="100%" />
    </body>
    </html>
    `;
    return app.respond.html(html);
});

server.customRouting({ method: ['GET', 'POST'], routing: '/multiple-methods' }, function (app) {
    return app.client.method();
});

module.exports = { server, config };