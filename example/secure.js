/**
 * DO NOT FORGET TO CREATE PRIVATE KEY AND CERTIFICATE FILE
 * 
 * See here for complete documentation
 * https://dakc.github.io/majidai.html
 */

// import majidai
const majidai = require("majidai");

// put private key and certificate on ssl folder
const config = {
    ssl:{ 
        key: 'ssl/key.pem',
        cert: 'ssl/cert.pem',
        port: 443,
        http2: false, // making true activates h2 protocol
        http: true, // making false will listen https only not http
      }
};

// create instance
const server = new majidai();

// create routing
server.get("/", function (app) {
    return "welcome to secure world.";
});

// start listening server
server.start();