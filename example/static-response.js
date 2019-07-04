/**
 * See here for complete documentation
 * https://dakc.github.io/majidai.html
 * 
 * 1. run 
 *  node static-response.js
 * 2. access to http://localhost/static
 * NOTE:
 * Change port by referencing custom-config.js if 80 is not available
 */

// import majidai
const majidai = require("majidai");

// create instance
const server = new majidai();

// respond static file
server.get("/static", function (app) {
    return app.respond.static("./custom-config.js");
});

// start listening server
server.start();