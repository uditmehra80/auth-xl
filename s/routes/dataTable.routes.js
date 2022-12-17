const express = require("express");
const router = express.Router();
const { requireLogin } = require("../middleware/Authenticate");

const {
    getAllDataTable,
    getDataTables,
    uploadDataTable,
    deleteDataTable
} = require("../controllers/dataTable.controller");

router.get("/get-dataTable", getAllDataTable);

router.get("/get-dataTable/:id", getDataTables);

router.post("/upload-dataTable", requireLogin, uploadDataTable);

router.delete("/delete-dataTable/:id", requireLogin, deleteDataTable);

module.exports = router;
