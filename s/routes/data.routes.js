const express = require("express");
const router = express.Router();
const { requireLogin } = require("../middleware/Authenticate");

const {
    getAllData,
    getSpecificData,
    getDatas,
    uploadData
} = require("../controllers/data.controller");


router.get("/get-allData", getAllData);

router.post("/get-specific-data", getSpecificData);

router.get("/get-datas/:id", getDatas);

router.post("/upload-data", requireLogin, uploadData);

module.exports = router;
