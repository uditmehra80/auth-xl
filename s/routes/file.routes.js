const express = require("express");
const router = express.Router();
const { requireLogin } = require("../middleware/Authenticate");

const {
    getFile,
    uploadFile,
    deleteFile
} = require("../controllers/file.controller");

router.get("/get-file", getFile);

router.post("/upload-file", requireLogin, uploadFile);

router.delete("/delete-file/:id", requireLogin, deleteFile);

module.exports = router;
