/**
 * See here for complete documentation
 * https://dakc.github.io/majidai.html
 */

// import majidai
const majidai = require("majidai");

// create instance
const server = new majidai();

// GET routing
server.get("/", function (app) {
    return "Hello majidai";
});

server.onError(function (errObj) {

    //  send mail to admin or do something else
    // ..

    // custom 404
    if (errObj.errCode == 404) {
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
    } 
    
    // custom 500
    if (errObj.errCode == 500) {
        errObj.contentType = "text/plain";
        errObj.errMsg = "Woops! Something Went Wrong."
    }

    // other errors will be set to default

    //return error object
    return errObj;
});

// start listening server
server.start();