const mongoose = require("mongoose");

const dataTableSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    file_id: {
        type: String,
        required: true,
    },
    data: {
        type: Array,
        required: true,
        default: [],
    },
    data_id: {
        type: String,
    },
    created_at: { type: Date, default: () => Date.now() },
});

const Event = mongoose.model("DATATABLE", dataTableSchema, "dataTable");

module.exports = Event;
