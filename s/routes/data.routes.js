const express = require("express");
const router = express.Router();

const {
    getAllData,
    getDatas,
    uploadData
} = require("../controllers/data.controller");

router.get("/get-allData", getAllData);

router.get("/get-datas/:id", getDatas);

router.post("/upload-data", uploadData);

module.exports = router;
