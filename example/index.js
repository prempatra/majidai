// import majidai
const majidai = require("majidai");

// create instance
const server = new majidai({
    isProduction: false,
    log: {
        debug: true
    }
});

// gt routing
server.get("/", function (app) {
    return "Hello majidai";
});

// get routing with parameters
server.get("/books/{year}/{price}", function (app) {
    // parameters enclosed with {} can be accessed directly from data.getParams
    var yearParam = app.data.getParams("year");
    console.log(yearParam);
    var priceParam = app.data.getParams("price");
    console.log(priceParam);

    // get all GET parameters
    var getParams = app.data.getParams();
    // response GET data as JSON data
    return getParams;
});

// post routing
server.post("/", function (app) {
    // get all POST parameters
    var postParams = app.data.postParams();
    // response data as JSON data
    return postParams;
});

// start listening server
server.start();