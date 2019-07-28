// import majidai
const majidai = require("majidai");

// custom config
const config = {
    isProduction: false,
    log: {
        isWriteAccess: true,
        folder: "./log"
    },
    header : {
        "x-xss-protection": "0",
        "server": "majidai@docker",
        "Access-Control-Allow-Origin":"*",
    }
};

// create instance
const server = new majidai(config);

server.get("/", function (app) {
    return "Hello majidai";
});

// names inside {} can be directly accessed from getParams method
server.get("/books/{year}/{price}", function (app) {
    // get all the GET parameters as jSON object
    var getParams = app.data.getParams();

    // access to the variables set inside{}
    var yearParam = getParams.year;
    console.log(yearParam);
    var priceParam = getParams.price;
    console.log(priceParam);

    // when user access as /books/2020/2000?lang=eng
    // the value of lang parameter will be get by 
    var langParam = getParams.lang || "";

    return getParams;
});

// post routing
server.post("/", function (app) {
    // get all POST parameters
    var postParams = app.data.postParams();
    // response data as JSON data
    return postParams;
});

// logging
server.get("/logging", function (app) {
    app.logger.warn("warning");
    app.logger.info("info");
    app.logger.error("error");
    app.logger.debug("debug");

    return "how is the logger?";
});


// cookie manipulation
server.get("/cookie/{key}/{value}", function (app) {
    var userData = app.data.getParams();
    var cookieData = {
        key: userData.key,
        value: userData.value,
        httpOnly: userData.httpOnly ? true : false,
    };
    if (userData.expireDate) cookieData["expireDate"] = userData.expireDate;
    app.client.addCookie(cookieData);
    
    return app.client.getCookie();
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

server.onError(function (errObj) {

    //  send mail to admin or do something else
    // ..

    // custom response
    errObj.contentType = "text/html";
    errObj.errMsg = `
    <html>
    <head>
    <title>custom error</title>
    </head>
    <body>
        <h1><span style='color:#ff0000'>Woops!</span> Something Went Wrong</h1>
        <p>${errObj.errMsg}</p>
    </body>
    </html>
    `;

    return errObj;
});

// start listening server
server.start();