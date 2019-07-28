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
        // write every access infomation to log file in format(yyyy-mm-dd.access)
        // general logs will be written in app.log
        isWriteAccess: true,
        // folder to log
        folder: "./myfolder",
    },
    // change the server name
    header: {
        // deny iframe
        "x-frame-options": "DENY",
        // disable xss protection
        "x-xss-protection": "0",
        // set server name
        "server": "majidai@test",
        // allow cross origin to all
        "Access-Control-Allow-Origin":"*",
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