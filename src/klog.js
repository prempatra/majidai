const fs= require('fs');

class Klog {
    constructor(config,isProd=true) {
        try {
            this._isProduction = typeof isProd === "boolean" ? isProd : true;
            this._isDebug = false;
            this._isAcccess = false;
            this._isError = true;
            this._logFolder = "./log";
            this._validate(config);
        } catch (err) {
            throw err;
        }
    }

    /**
     * validate the configuration object
     * @param {object} config 
     */
    _validate(config) {
        if (config == undefined || typeof config != "object") return;
        if (Object.keys(config).length === 0) return;

        if (!config.hasOwnProperty("folder")) {
            config.folder = this._logFolder;
        }
        
        this._isDebug = config.hasOwnProperty("debug") ? config.debug : this._isDebug;
        this._isAcccess = config.hasOwnProperty("access") ? config.access : this._isAcccess;
        this._isError = config.hasOwnProperty("error") ? config.error : this._isError;
        this._logFolder = config.folder;

        if (!fs.existsSync(config.folder)) {
            fs.mkdirSync(config.folder);
            this.debug (`【log folder】「${config.folder}」 is created.`);
        }
    }

    /**
     * set logfile name to yyyy-mm-dd
     */
    _getFilename() {
        const zeroFill = (num) => { return num.toString().length < 2 ? Array(2).join("0") + num : num };
        const dateObj = new Date();
        return `${dateObj.getFullYear()}-${zeroFill(dateObj.getMonth() + 1)}-${zeroFill(dateObj.getDate())}`;
    }

    /**
     * write content to a file with utf8 encodeing assynchronously
     * 
     * @param {string} filePath 
     * @param {string} content 
     */
    _write(filePath, content) {
        var isProd = this._isProduction;
        var appendLog = () => {
            fs.appendFile(filePath, content + "\n", function (err) {
                if (isProd) return;
                err && console.error(err) || console.log(content);
            });
        }
        setTimeout(appendLog, 100);
    }

    /**
     * check if the given data is not empty string
     * @param {string} arg 
     */
    _isEmptyString(arg) {
        if (typeof arg !== "string") return false;
        if (!arg.trim().length) return false;
        return true;
    }

    /**
     * write error log to a file
     * if the application mode is not production,
     * then it will also show the log on console
     * @param {string} content 
     */
    error(content) {
        if(!this._isProduction) console.error(content);
        if (!this._isError) return true;
        if (!this._isEmptyString(content)) return false;
        this._write(`${this._logFolder}/${this._getFilename()}.error`, content);
    }

    /**
     * write debug log to a file
     * if the application mode is not production,
     * then it will also show the log on console
     * @param {string} content 
     */
    debug(content) {
        if(!this._isProduction) console.debug(content);
        if (!this._isDebug) return true;
        if (!this._isEmptyString(content)) return false;

        content = new Date().toLocaleString() + "," + content;
        this._write(`${this._logFolder}/${this._getFilename()}.debug`, content);
    }

    /**
     * write access log to a file
     * if the application mode is not production,
     * then it will also show the log on console
     * @param {string} content 
     */
    access(content) {
        if (!this._isAcccess) return true;
        if (!this._isEmptyString(content)) return false;

        this._write(`${this._logFolder}/${this._getFilename()}.access`, content);
    }
}
module.exports = Klog;