const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({

    dataTable_Id: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: null
    },
    value: {
        type: String,
    },

    created_at: { type: Date, default: () => Date.now() },

});

const Event = mongoose.model("DATA", dataSchema, "data");

dataSchema.pre('save', function (next) {
    this.date = new Date();
    next();
});
dataSchema.pre('update', function (next) {
    this.date = new Date();
    next();
});

module.exports = Event;
