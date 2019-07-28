const fs = require('fs');

class Klog {
    constructor(config) {
        try {
            this._config = config;
            this._logFile = config.folder + "/app.log";

            if (!fs.existsSync(config.folder)) {
                fs.mkdirSync(config.folder);
                this.info(`【log folder】「${config.folder}」 is created.`);
            }
        } catch (err) {
            throw err;
        }
    }

    /**
     * write content to a file with utf8 encodeing assynchronously
     * 
     * @param {string} filePath 
     * @param {string} content 
     */
    _write(filePath, content) {
        try {
            fs.appendFile(filePath, content + "\n", function (err) {
                err && console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * write error log to a file
     * if the application mode is not production,
     * then it will also show the log on console
     * @param {string} content 
     */
    error(content) {
        if (!this._config.isProd) console.error(content);
        if (typeof content !== "string") return false;
        content = "ERROR," + new Date().toLocaleString() + "," + content;
        this._write(this._logFile, content);
    }

    /**
     * write debug log to a file
     * if the application mode is not production,
     * then it will also show the log on console
     * @param {string} content 
     */
    debug(content) {
        if (!this._config.isProd) console.debug(content);
        if (typeof content !== "string") return false;
        content = "DEBUG," + new Date().toLocaleString() + "," + content;
        this._write(this._logFile, content);
    }

    /**
     * write info log to a file
     * if the application mode is not production,
     * then it will also show the log on console
     * @param {string} content 
     */
    info(content) {
        if (!this._config.isProd) console.info(content);
        if (typeof content !== "string") return false;
        content = "INFO," + new Date().toLocaleString() + "," + content;
        this._write(this._logFile, content);
    }

    /**
     * write warn log to a file
     * if the application mode is not production,
     * then it will also show the log on console
     * @param {string} content 
     */
    warn(content) {
        if (!this._config.isProd) console.warn(content);
        if (typeof content !== "string") return false;
        content = "WARNING," + new Date().toLocaleString() + "," + content;
        this._write(this._logFile, content);
    }

    /**
     * write access log to a file
     * if the application mode is not production,
     * then it will also show the log on console
     * @param {string} content 
     */
    access(content) {
        if (!this._config.isProd) console.log(content);
        if (!this._config.isWriteAccess) return true;
        if (typeof content !== "string") return false;

        // set logfile name to yyyy-mm-dd
        var getFilename = () => {
            const zeroFill = (num) => {
                return num.toString().length < 2 ? Array(2).join("0") + num : num
            };
            const dateObj = new Date();
            return `${dateObj.getFullYear()}-${zeroFill(dateObj.getMonth() + 1)}-${zeroFill(dateObj.getDate())}`;
        }

        this._write(`${this._config.folder}/${getFilename()}.access`, content);
    }
}
module.exports = Klog;