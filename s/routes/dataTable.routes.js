const express = require("express");
const router = express.Router();

const {
    getAllDataTable,
    getDataTables,
    uploadDataTable
} = require("../controllers/dataTable.controller");

router.get("/get-dataTable", getAllDataTable);

router.get("/get-dataTable/:id", getDataTables);

router.post("/upload-dataTable", uploadDataTable);

module.exports = router;
