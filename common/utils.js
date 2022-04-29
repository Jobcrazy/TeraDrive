const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const error_code = require("./errorCode");

const Utils = {
    //创建时间格式化显示
    dateFtt: function (fmt, date) {
        //author: meizz
        let o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            S: date.getMilliseconds(), //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(
                RegExp.$1,
                (date.getFullYear() + "").substr(4 - RegExp.$1.length)
            );
        for (let k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(
                    RegExp.$1,
                    RegExp.$1.length == 1
                        ? o[k]
                        : ("00" + o[k]).substr(("" + o[k]).length)
                );
        return fmt;
    },
    crtTimeFtt: function () {
        let crtTime = new Date();
        return this.dateFtt("yyyy-MM-dd hh:mm:ss", crtTime);
    },
    crtTimeMs: function () {
        let crtTime = new Date();
        return this.dateFtt("hh-mm-ss-S", crtTime);
    },
    crtTimeDate: function () {
        let crtTime = new Date();
        return this.dateFtt("yyyy-MM-dd", crtTime);
    },
    mkdirsSync: function (dirpath, mode) {
        if (!fs.existsSync(dirpath)) {
            let pathtmp;
            dirpath.split(path.sep).forEach(function (dirname) {
                if (dirname === "") {
                    dirname = "/";
                }
                if (pathtmp) {
                    pathtmp = path.join(pathtmp, dirname);
                } else {
                    pathtmp = dirname;
                }
                if (!fs.existsSync(pathtmp)) {
                    if (!fs.mkdirSync(pathtmp, mode)) {
                        return false;
                    }
                }
            });
        }
        return true;
    },
    SendResult: function (res, data) {
        let result = {
            code: error_code.error_success.code,
            message: error_code.error_success.message,
        };

        if (typeof data === "object") {
            result.data = data;
        }

        res.send(result);
    },
    SendError: function (res, err) {
        let result = {
            code: err && err.code ? err.code : error_code.error_unknown.code,
            message:
                err && err.message
                    ? err.message
                    : error_code.error_unknown.message,
        };
        res.send(result);
    },
    CalcFileMD5: function (filePath) {
        return new Promise(function (resolve, reject) {
            const stream = fs.createReadStream(filePath);
            const hash = crypto.createHash("md5");
            stream.on("data", (chunk) => {
                hash.update(chunk, "utf8");
            });
            stream.on("end", () => {
                const md5 = hash.digest("hex");
                stream.close();
                resolve(md5);
            });
            stream.on("error", (err) => {
                reject(err);
            });
        });
    },
    CalcStringMD5: function (s) {
        let c = crypto.createHash("md5");
        c.update(s);
        return c.digest("hex");
    },
};

module.exports = Utils;
