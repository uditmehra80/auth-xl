const { Schema, model } = require("mongoose");

const dataTableSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    file_id: {
        type: Schema.Types.ObjectId,
        ref: 'FILE',
        type: String,
        required: true,
    },
    // data: {
    //     type: Array,
    //     required: true,
    //     default: [],
    // },

    created_at: { type: Date, default: () => Date.now() },
});

const Event = model("DATATABLE", dataTableSchema, "dataTable");

module.exports = Event;
