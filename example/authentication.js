/**
 * See here for complete documentation
 * https://dakc.github.io/majidai.html
 */

// import majidai
const majidai = require("majidai")

// create instance
const server = new majidai();

// 1. access to http://localhost/login.html from browser which will show
// content from login.html inside public folder

// 2. authentication
server.post("/login", function (app) {
    // get post data
    var postParams = app.data.postParams();

    // get login id (form input name=login_id)
    var userId = postParams.login_id;

    // get login password (form input name=login_pass)
    var userPass = postParams.login_pass;

    // DO AS PER YOUR NEED
    // check user id & pass (user authentication)
    var isLogged = function () {
        // TODO
        // eg, get data from db and compare

        // JUST FOR TUTORIAL
        if (userId === "abc" && userPass === "abc") {
            return true;
        } else {
            return false;
        }
    }();

    if (isLogged) {
        // trigger login check
        // if the routing including mustBeAuthorized is called before executing here,
        // code after mustBeAuthorized wont be executed
        app.triggerAuthCheck();
        // remember user id 
        app.session.put("user_id", userId);
        // redirect to /home
        return app.respond.redirect("/home");
    }

    // unauthorized login
    // redirect to top page
    return app.respond.redirect("/login.html?msg=login%20failed");
});

// 3. sensible content
server.get("/home", function (app) {
    // unauthorized access
    if (!app.mustBeAuthorized("UnAuthorized Access")) return;

    // below here for authorized user
    //  get data from session
    var sessionData = app.session.get();
    return "Hello Authorized user " + sessionData.user_id;
});

// 4. clear the user data
server.get("/logout", function (app) {
    // destroy session data
    app.session.destroy();

    // redirect to top page
    return app.respond.redirect("/login.html?msg=logged%20out");
});

// start listening server
server.start();