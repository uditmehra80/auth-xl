const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true,
    },
    description: {
        type: Object,
    },
    referenceId: {
        type: String,
        required: true,
    },
    created_at: { type: Date, default: () => Date.now() },
});

const Event = mongoose.model("FILE", fileSchema, "file");

module.exports = Event;
