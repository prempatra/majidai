// import majidai
const majidai = require("../index");

const config = {
    port: 8000,
    maxBodySize: 10000 * 1024,
    header : {
        "x-content-type-options": "",
        "x-frame-options": "*",
        "x-xss-protection": "0;",
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
    app.triggerLoginCheck();
    app.session.put("name", "user1");
    return app.data.postParams();
});
server.get("/dashboard", function (app) {
    if (!app.mustBeLoggedIn("not logged user")) return;
    return app.session.get();
});

module.exports = { server, config };