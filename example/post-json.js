/**
 * See here for complete documentation
 * https://dakc.github.io/majidai.html
 */

// import majidai
const majidai = require("majidai");

// create instance
const server = new majidai();

// routing
server.post("/json", function (app) {
	// get post data
	var postParams = app.data.postParams();
	console.log(postParams);

	// return the data as received
	return postParams;
});

// start listening server
server.start();