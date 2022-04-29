const express = require("express");
const router = express.Router();
const formidable = require("formidable");
const utils = require("../common/utils");
const auth = require("../common/auth");
const error_code = require("../common/errorCode");
const File = require("../model/file");
const fs = require("fs");
const User = require("../model/user");

// File upload
router.post("/upload", auth, function (req, res) {
    // Make directories
    let publicDir = __dirname.replace("routes", "public/");
    let uploadDir = publicDir + "uploads/";
    if (
        !utils.mkdirsSync(publicDir, "0777") ||
        !utils.mkdirsSync(uploadDir, "0777")
    ) {
        return utils.SendError(res, error_code.error_form);
    }

    // Receive file
    let form = new formidable.IncomingForm();
    form.encoding = "utf-8";
    form.uploadDir = uploadDir;
    //form.maxFileSize = 20 * 1024 * 1024; //Max file size
    form.parse(req, async function (err, fields, files) {
        if (err || !files.file || !files.file.path) {
            return utils.SendError(res, error_code.error_form);
        }

        let fileName = files.file.name;
        let oldPath = files.file.path;
        let fileMD5 = null;

        try {
            fileMD5 = await utils.CalcFileMD5(oldPath);
        } catch (err) {
            return utils.SendError(res, error_code.error_io);
        }

        let file = await File.findOne({
            where: {
                md5: fileMD5,
            },
        });

        // If file already exists
        if (file) {
            fs.unlinkSync(oldPath);
            return utils.SendResult(res, file);
        }

        // Make directories
        let levelOneDir = uploadDir + fileMD5.substring(0, 2);
        let levelTwoDir =
            levelOneDir + "/" + fileMD5.substring(fileMD5.length - 2);
        if (
            !utils.mkdirsSync(levelOneDir, "0777") ||
            !utils.mkdirsSync(levelTwoDir, "0777")
        ) {
            return utils.SendError(res, error_code.error_io);
        }

        // Move file to new path
        let newPath =
            levelTwoDir +
            "/" +
            fileMD5 +
            "." +
            fileName.split(".")[fileName.split(".").length - 1];
        if (!fs.existsSync(newPath)) {
            fs.rename(oldPath, newPath, function (err) {
                if (err) {
                    return utils.SendError(res, error_code.error_io);
                }
            });
        }

        // Insert into Database
        let newFileName =
            fileMD5 + "." + fileName.split(".")[fileName.split(".").length - 1];
        let newRelativePath =
            "/uploads/" +
            fileMD5.substring(0, 2) +
            "/" +
            fileMD5.substring(fileMD5.length - 2) +
            "/" +
            fileMD5 +
            "." +
            fileName.split(".")[fileName.split(".").length - 1];

        try {
            file = await File.create({
                name: fileName,
                path: newRelativePath,
                md5: fileMD5,
            });
        } catch (e) {
            return utils.SendError(res, e);
        }

        return utils.SendResult(res, file);
    });
});

module.exports = router;
