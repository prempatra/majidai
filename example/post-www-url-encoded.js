/**
 * See here for complete documentation
 * https://dakc.github.io/majidai.html
 * 
 * 1. run 
 * 	node post-www-url-encoded.js
 * 2. access to http://localhost/post_url_encode.html
 * 	and hit submit button
 * NOTE:
 * Change port by referencing custom-config.js if 80 is not available
 */

// import majidai
const majidai = require("majidai");

// create instance
const server = new majidai();

// routing
server.post("/", function (app) {
	// get post data
	var postParams = app.data.postParams();
	console.log(postParams);

	// return the data as received
	return postParams;
});

// start listening server
server.start();