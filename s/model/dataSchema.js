const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({

    dataTable_Id: {
        type: String,
        required: true,
    },
    date: {
        type: String,
    },
    value: {
        type: String,
    },

    created_at: { type: Date, default: () => Date.now() },

});

const Event = mongoose.model("DATA", dataSchema, "data");

module.exports = Event;
