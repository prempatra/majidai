const needle = require('needle');
const assert = require("chai").assert;
const server = require("./server").server;
const url = "http://localhost:" + require("./server").config.port;

before(function () {
    server.start();
});

after(function () {
    setTimeout(() => server.stop(), 500);
});

describe("test for content-type", () => {
    it("should be text/plain", (done) => {
        needle('get', `${url}/`)
            .then(res => {
                assert.include(res.headers["content-type"], "text/plain");
                assert.equal(res.body, "Welcome to majidai");
                done();
            })
            .catch(err => { console.error(err); done() });
    });

    it("should be text/html", (done) => {
        needle('get', `${url}/html`)
            .then(res => {
                assert.include(res.headers["content-type"], "text/html");
                assert.equal(res.body, "<h1>Welcome to majidai</h1>");
                done();
            })
            .catch(err => { console.error(err); done() });
    });

    it("should be application/json", (done) => {
        needle('get', `${url}/json`)
            .then(res => {
                assert.include(res.headers["content-type"], "application/json");
                assert.isTrue("id" in res.body);
                assert.equal(res.body.id, 1);
                assert.isTrue("name" in res.body);
                assert.equal(res.body.name, "user1");
                done();
            })
            .catch(err => { console.error(err); done() });
    });

    it("should be text/html for static html files", (done) => {
        needle('get', `${url}/static-html`)
            .then(res => {
                assert.include(res.headers["content-type"], "text/html");
                assert.include(res.body, "!DOCTYPE html");
                done();
            })
            .catch(err => { console.error(err); done() });
    });

    it("should be application/pdf for static pdf files", (done) => {
        needle('get', `${url}/static-pdf`)
            .then(res => {
                assert.include(res.headers["content-type"], "application/pdf");
                assert.instanceOf(res.body, Buffer);
                done();
            })
            .catch(err => { console.error(err); done() });
    });
});


describe("test for status code", () => {
    it('should return 200', (done) => {
        needle('get', `${url}/`)
            .then(res => assert.equal(res.statusCode, 200))
            .catch(err => console.error(err))
            .finally(done());
    });

    it('should return 404', (done) => {
        needle('get', `${url}/doesnotexists`)
            .then(res => assert.equal(res.statusCode, 404))
            .catch(err => console.error(err))
            .finally(done());
    });

    it('should return 401', (done) => {
        needle('get', `${url}/dashboard`)
            .then(res => assert.equal(res.statusCode, 401))
            .catch(err => console.error(err))
            .finally(done());
    });

    it('should return 402', (done) => {
        needle('get', `${url}/error?code=402`)
            .then(res => assert.equal(res.statusCode, 402))
            .catch(err => console.error(err))
            .finally(done());
    });

    it('should return 501', (done) => {
        needle('get', `${url}/error?code=501`)
            .then(res => assert.equal(res.statusCode, 501))
            .catch(err => console.error(err))
            .finally(done());
    });
});

describe("test for POST method", () => {
    var data = {
        name: 'user2',
        age: '22'
    };
    it("should return the same data in json format while sending data as www-form-urlencoded format", (done) => {
        needle('post', `${url}/login`, data)
            .then(res => assert.deepEqual(res.body, data),done())
            .catch(err => { console.error(err); done() });
    });

    it("should return the same data in json format while sending data as json format", (done) => {
        needle('post', `${url}/login`, data, {json:true})
            .then(res => assert.deepEqual(res.body, data),done())
            .catch(err => { console.error(err); done() });
    });

    // // should import formidable to do this
    // it("should return the same data in multipart format while sending data as json format", (done) => {
    //     needle('post', `${url}/login`, data, { multipart: true })
    //         .then(res => assert.deepEqual(res.body, data),done())
    //         .catch(err => { console.error(err); done() });
    // });
});


describe("test for session data", () => {
    const headers = {
        headers: {
            'Cookie': '__KSESID=unittest'
        }
    };
    it("should save data into session", (done) => {
        // set data which will not be deleted unless destroy is called
        needle('get', `${url}/session/set/type/normal`, headers);
        // set data which will be deleted
        needle('get', `${url}/session/set/name/majidai`, headers)
            .then(res => {
                assert.isTrue("name" in res.body);
                assert.equal(res.body.name, "majidai");
                done();
            })
            .catch (err => { console.error(err); done() });
    });

    it("should get the data from session", (done) => {
        needle("get", `${url}/session/get/name`, headers)
            .then(res => assert.equal(res.body, "majidai"), done())
            .catch (err => { console.error(err); done() });
    });

    it("should delete the key name only from session", (done) => {
        needle("get", `${url}/session/delete/name`, headers)
            .then(res => {
                assert.isFalse("name" in res.body);
                assert.isTrue("type" in res.body);
                assert.equal(res.body.type, "normal");
                done();
            })
            .catch (err => { console.error(err); done() });
    });

    it("should delete all the data from session", (done) => {
        needle("get", `${url}/session/destroy`, headers)
            .then(res => {
                assert.isFalse("name" in res.body);
                assert.isFalse("type" in res.body);
                assert.isEmpty(res.body);
                done();
            })
            .catch (err => { console.error(err); done() });
    });
});

describe("test for headers", () => {
    it("should return x-content-type-options to be empty string", done => {
        needle('get', url)
            .then(res => {
                assert.isEmpty(res.headers["x-content-type-options"]);
                done();
            })
            .catch(err => { console.error(err); done() });
    });

    it("should return x-frame-options to be deny", done => {
        needle('get', url)
            .then(res => {
                assert.equal(res.headers["x-frame-options"],"deny");
                done();
            })
            .catch(err => { console.error(err); done() });
    });

    it("should return x-xss-protection to be 0", done => {
        needle('get', url)
            .then(res => {
                assert.equal(res.headers["x-xss-protection"],0);
                done();
            })
            .catch(err => { console.error(err); done() });
    });

    it("should return Access-Control-Allow-Origin to be *", done => {
        needle('get', url)
            .then(res => {
                assert.equal(res.headers["access-control-allow-origin"],"*");
                done();
            })
            .catch(err => { console.error(err); done() });
    });


    it("should return server", done => {
        needle('get', url)
            .then(res => {
                assert.equal(res.headers["server"],"majidai@test");
                done();
            })
            .catch(err => { console.error(err); done() });
    });
});

describe("test for cookie manipulation", (done) => {
    it("should return default cookie with name __KSESID", done => {
        needle('get', url)
            .then(res => {
                assert.include(res.headers["set-cookie"][0], "__KSESID");
                done();
            })
            .catch(err => { console.error(err); done() });
    });

    it("should return 2 cookies, first to be the default and second to be the cookie set by user", (done) => {
        needle('get', `${url}/cookie/poweredby/majidai`)
            .then(res => {
                assert.equal(res.headers["set-cookie"].length, 2);
                assert.include(res.headers["set-cookie"][0], "__KSESID");
                assert.equal(res.headers["set-cookie"][1], "poweredby=majidai;");
                done();
            })
            .catch(err => { console.error(err); done() });
    });

    it("should return cookie with httponly parameter activated", (done) => {
        needle('get', `${url}/cookie/author/dakc?httpOnly=1`)
            .then(res => {
                assert.equal(res.headers["set-cookie"].length, 2);
                assert.include(res.headers["set-cookie"][0], "__KSESID");
                assert.equal(res.headers["set-cookie"][1], "author=dakc; HttpOnly;");
                done();
            })
            .catch(err => { console.error(err); done() });
    });

    it("should return cookie with http only and expires parameter activated", (done) => {
        const expireDate = new Date();
        needle('get', `${url}/cookie/poweredby/majidai?httpOnly=1&expireDate=${expireDate}`)
            .then(res => {
                assert.equal(res.headers["set-cookie"].length, 2);
                assert.include(res.headers["set-cookie"][0], "__KSESID");
                let userSetCookie = `poweredby=majidai; HttpOnly; Expires=${expireDate};`;
                // cookie will remove + sign from GMT
                // for eg
                // poweredby=majidai; HttpOnly; Expires=Sun Jul 28 2019 11:13:34 GMT+0900 (GMT+09:00);
                // will be
                // poweredby=majidai; HttpOnly; Expires=Sun Jul 28 2019 11:13:34 GMT 0900 (GMT 09:00);
                userSetCookie = userSetCookie.replace(/GMT\+/g, "GMT ");
                assert.equal(res.headers["set-cookie"][1], userSetCookie);
                done();
            })
            .catch(err => { console.error(err); done() });
    });

    it("should delete the default cookie with name __KSESID", done => {
        needle('get', `${url}/cookie/__KSESID?type=delete`)
            .then(res => {
                assert.equal(res.headers["set-cookie"].length, 1);
                // the value will be empty and expiry date will be past
                assert.include(res.headers["set-cookie"][0], "__KSESID=; expires=Thu Jan 01 1970");
                done();
            })
            .catch(err => { console.error(err); done() });
    });
});