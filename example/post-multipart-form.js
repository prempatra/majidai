/**
 * See here for complete documentation
 * https://dakc.github.io/majidai.html
 * 1. run 
 * 	node post-multipart-form.js
 * 2. access to http://localhost/post_multipart_form.html
 * 	and hit submit button
 * 
 * NOTE:
 * 1. Change port by referencing custom-config.js if 80 is not available
 * 2. install formidable if not exist
 * npm install formidable
 */

// import majidai
const majidai = require("majidai");

// import formidable
const formidable = require('formidable');

// create instance
const server = new majidai();

// receive multipart-form data
server.post("/upload", function (app) {
    var form = new formidable.IncomingForm();
    form.uploadDir = "public";
    form.keepExtensions = true;
    var fields = [];
    var files = [];

    form
        .on('error', function (err) {
            console.error(err);
        })
        .on('field', function (field, value) {
            fields.push([field, value]);
        })
        .on('file', function (field, file) {
            files.push([field, file]);
        })
        .on('end', function () {
            var dt = "<pre>" + JSON.stringify(fields, null, 4) + "</pre>";
            dt += "<br><br><pre>" + JSON.stringify(files, null, 4) + "</pre>";
            return app.respond.html(dt);
        });
    form.parse(app.native.request());
});

// start listening server
server.start();