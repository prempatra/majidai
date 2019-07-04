/**
 * See here for complete documentation
 * https://dakc.github.io/majidai.html
 */

// import majidai
const majidai = require("majidai");

// customize configuration
const customConfig = {
    // chnage the port
    port: 8000,
    // set production mode to false
    // it will show the log contents on console
    isProduction: false,
    // log
    log: {
        // activate access log
        // write every access infomation to log file
        access: true,
        // activate debug log
        debug: true,
    },
    // change the server name
    header: {
        server: "majidai_server_test",
    }
};

// create instance
const server = new majidai(customConfig);

// GET routing
server.get("/", function (app) {

    // write debug log
    app.logger.debug("logging ....");

    return "Hello majidai";
});
// start listening server
server.start();