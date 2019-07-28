/**
 * See here for complete documentation
 * https://dakc.github.io/majidai.html
 */

// import majidai
const majidai = require("majidai");

// create instance
const server = new majidai();

server.get("/", function (app) {
    // get all the GET parameters as jSON object
    var getParams = app.data.getParams();

    // get specific parameter 
    // when key is passed to getParams it will return the value of that key 
    // else, all the parameters and their value
    var yearParam = app.data.getParams("year");

    return "Handling GET parameters.";
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

// start listening server
server.start();