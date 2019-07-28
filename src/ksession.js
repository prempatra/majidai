const CRYPTO = require("crypto");
const SESSION_VAR = require("./constants").SESSION_VAR;

// @NOTE
// users are not allowed to save  key  __TM, __LG
const LAST_ACCESS_TIME = SESSION_VAR.lastAccess; // __TM

class Ksession {
    /**
     * create user collection
     * 
     * @param {object}  | (activate,timeOut)
     */
    constructor(config) {
        this.config = config;
        // create user collection to store user data
        this.data = new Map();
        // session alive time
        this.allowedTime = config.timeOut || 1000 * 60 * 5;
        // config variables
        this.vars = SESSION_VAR;
    }

    /**
     * create a unique id with given length
     * 
     * @param {number} cnt | length of id, default is 8
     * @returns {string} unique id
     */
    uniqueId(cnt) {
        if (cnt == undefined || typeof cnt != "number") cnt = 8;
        return CRYPTO.randomBytes(cnt).toString("hex");
    }

    /**
     * generate an ID for user
     * 
     * @returns {string} unique id + current time in milliseconds
     * uqnique id will be of length 16
     * current time in ms will be of length 13
     */
    genId() {
        let id = this.uniqueId(16);
        let timeStamp = +new Date();
        let sessId = `${id}${timeStamp}`;
        this.createUser(sessId);
        return sessId;
    }

    /**
     * insert the id, and access time in milliseconds
     * of user into user collection
     * 
     * @param {string} id 
     */
    createUser(id) {
        // from es6 var myValue = "this_is_value";var myKey = "this_is_key";var obj = {[myKey]: myValue}; // => {"this_is_key": "this_is_value"}
        this.data.set(id, {
            [LAST_ACCESS_TIME]: +new Date()
        });
    }

    /**
     * remove the overtimed session id 
     * and update access time for current user
     * 
     * @param {string} userId | id 
     */
    validateUser(userId) {
        let userData = this.data.get(userId);
        if (typeof userData == "undefined") return;

        // delete the data from session whose access time is over then the given time.
        if (userData[LAST_ACCESS_TIME] < (+new Date() - this.allowedTime)) {
            this.createUser(userId);
            return;
        }

        // update access time
        userData[LAST_ACCESS_TIME] = +new Date();
    }

    /**
     * remove the overtimed session data
     */
    validateAll() {
        // delete the data from session whose access time is over then the given time.
        for (let [user, dt] of this.data) {
            if (userData[LAST_ACCESS_TIME] < (+new Date() - this.allowedTime)) {
                if(this.data.has(user)) this.data.delete(user);
            }
        }
    }

    /**
     * regenerate the id for a given user
     * 
     * @param {string} id | user id
     */
    regenId(id) {
        // delete all the datas
        this.destroy(id);
        // create new unique id
        return this.genId();
    }

    /**
     * set user data as {key:val} into db
     * 
     * @param {string} id 
     * @param {string} key 
     * @param {any} val 
     * @returns {boolean} false if failed else true
     */
    put(id, key, val) {
        if (id == undefined || id == null || id == "" || key == LAST_ACCESS_TIME) return false;
        if (key == undefined || typeof key !== "string" || key.trim() == "") return false;
        if (val == undefined) return false;

        let usrDt = this.getAll(id);
        if (typeof usrDt !== "object") return false;
        Object.defineProperty(usrDt, key, {
            value: val,
            enumerable: true,
            configurable: true
        })

        return true;
    }

    /**
     * get data for a given user
     * it will return all the documents if key is not received
     * else, will return the value of that key
     * 
     * @param {string} id 
     * @param {string} key 
     */
    get(id, key) {
        if (id == undefined || id == null || id == "") return "";
        var usrDt = this.getAll(id);
        if (key == undefined || key == null || key == "") return usrDt;

        if (usrDt.hasOwnProperty(key)) return usrDt[key];
        return "";
    }

    /**
     * get data for a given user
     * 
     * @param {string} id | user id
     */
    getAll(id) {
        return this.data.get(id) || {};
    }

    /**
     * delete the data with given key from user data
     * 
     * @param {string} id | user id
     * @param {string} key | key to be deleted
     */
    delete(id, key) {
        if (id == undefined || id == null || id == "") return;
        if (key == undefined || typeof key !== "string") return;
        let usrDt = this.getAll(id);
        if (typeof usrDt !== "object") return;

        if (usrDt.hasOwnProperty(key)) delete usrDt[key];
    }

    /**
     * delete all the datas for a given user
     * 
     * @param {string} id | id of the user whose data is to be deleted
     */
    destroy(id) {
        if(this.data.has(id)) this.data.delete(id);
    }
}

module.exports = Ksession;