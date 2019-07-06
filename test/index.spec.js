const http = require('http');
const needle = require('needle');

const assert = require("chai").assert;
const server = require("../server");
const url = "http://localhost:8000";

before(function () {
    server.start();
});

after(function () {
    setTimeout(() => server.stop(), 500);
});

describe("test for content-type", () => {
    it("should be text/plain", () => {
        http.get(url, res => assert.include(res.headers["content-type"], "text/plain"));
    });

    it("should be text/html", () => {
        http.get(`${url}/login`, res => assert.include(res.headers["content-type"], "text/html"));
    });

    it("should be application/json", () => {
        http.get(`${url}/books/`, res => assert.include(res.headers["content-type"], "application/json"));
    });
});


describe("test for status code", () => {
    it('should return 200', () => {
        http.get(`${url}/`, res => assert.equal(res.statusCode, 200));
    });

    it('should return 404', () => {
        http.get(`${url}/doesnotexists`, res => assert.equal(res.statusCode, 404));
    });


    it('should return 401', () => {
        http.get(`${url}/admin`, res => assert.equal(res.statusCode, 401));
    });
});


describe("test for response body", () => {
    it('should say "Welcome to majidai"', () => {
        http.get(`${url}/`, res => {
            var data = '';
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on('end', function () {
                assert.equal(data, "Welcome to majidai");
            });
        });
    });

    it('should return json string', () => {
        http.get(`${url}/books/2000/50?name=awesome`, res => {
            var data = '';
            var expectedResult = {
                year: 2000,
                price: 50,
                name: "awesome"
            };
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on('end', function () {
                var actualResult = JSON.parse(data);
                for (let key in expectedResult) {
                    assert.equal(actualResult[key], expectedResult[key]);
                }
            });
        });
    });
});



describe("test for session data", () => {
    const headers = {
        headers: {
            'Cookie': '__KSESID=unittest'
        }
    };
    it("should save data into session", (done) => {
        needle('get', `${url}/session/set/name/majidai`, headers)
            .then(res => assert.equal(res.body.name, "majidai"))
            .then(() => done())
            .catch (err => { console.error(err); done() });
    });

    it("should get the data from session", (done) => {
        needle("get", `${url}/session/get/name`, headers)
            .then(res => assert.equal(res.body, "majidai"))
            .then(() => done())
            .catch (err => { console.error(err); done() });
    });
});