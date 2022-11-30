const DataTable = require("../model/dataTableSchema");


exports.getAllDataTable = function (req, res) {
    DataTable.find({},
        function (err, datatables) {
            if (err) {
                console.log(err);
                res.status(500).json({
                    status: 500,
                    error: err,
                });
            } else {
                res.status(200).json({
                    status: 200,
                    data: datatables,
                });
            }
        }
    );
};

exports.getDataTables = function (req, res) {

    DataTable.find({ file_id: req.params.id },
        function (err, datatables) {
            if (err) {
                console.log(err);
                res.status(500).json({
                    status: 500,
                    error: err,
                });
            } else {
                res.status(200).json({
                    status: 200,
                    data: datatables,
                });
            }
        }
    );
};

exports.uploadDataTable = async (request, response) => {
    const DataObj = request.body;

    // console.log(DataObj);
    const result = await DataTable(DataObj).save();
    // ! Use try-catch for error handling

    response.send({
        message: "posted new Datatable",
        result: result,
    });
};



