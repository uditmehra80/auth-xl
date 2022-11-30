const Data = require("../model/dataSchema");


exports.getAllData = function (req, res) {
    Data.find({ dataTable_Id: req.dataTable_Id },
        function (err, data) {
            if (err) {
                console.log(err);
                res.status(500).json({
                    status: 500,
                    error: err,
                });
            } else {
                res.status(200).json({
                    status: 200,
                    data,
                });
            }
        }
    );
};

exports.getDatas = function (req, res) {
    Data.find({ dataTable_Id: req.params.id },
        function (err, data) {
            if (err) {
                console.log(err);
                res.status(500).json({
                    status: 500,
                    error: err,
                });
            } else {
                res.status(200).json({
                    status: 200,
                    data,
                });
            }
        }
    );
};

exports.uploadData = async (req, res) => {
    Data.insertMany(req.body)
        .then(() => {
            res.status(200).json({ status: 200, message: "Data has been added" });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({
                status: 500,
                error: "Data is not saved",
                message: error,
            });
        });
};



