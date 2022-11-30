const express = require("express");
const router = express.Router();

const {
    getFile,
    uploadFile,
    deleteFile
} = require("../controllers/file.controller");

router.get("/get-file", getFile);

router.post("/upload-file", uploadFile);

router.delete("/delete-file/:id", deleteFile);

module.exports = router;
