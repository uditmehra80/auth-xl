const File = require("../model/fileSchema");
const DataTable = require("../model/dataTableSchema");
const Data = require("../model/dataSchema");



exports.getFile = function (req, res) {
    try {

        File.find(
            {},
            function (err, files) {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        status: 500,
                        error: err,
                    });
                } else {
                    res.status(200).json({
                        status: 200,
                        data: files,
                    });
                }
            }
        );
    } catch (err) {
        res.send("error" + err);
        console.log(err)
    }
};

exports.uploadFile = async (request, response) => {
    try {
        const DataObj = request.body;

        // console.log(DataObj);
        const result = await File(DataObj).save();
        // ! Use try-catch for error handling

        response.send({
            message: "posted new file",
            result: result,
        });
    } catch (err) {
        res.send("error" + err);
        console.log(err)
    }
};

exports.deleteFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        file.remove();

        DataTable.find(
            { file_id: req.params.id },
            function (err, tables) {
                tables.map(async (table) => {
                    table.remove();
                    await Data.find(
                        { dataTable_Id: table._id },
                        function (err, datas) {
                            datas.map((data) => {
                                data.remove();
                            })
                        }
                    );
                    Data.deleteMany({ dataTable_Id: table._id })
                })
                res.send("file deleted with name of" + file.filename);
            }
        );

    } catch (err) {
        res.send("error" + err);
        console.log(err)
    }
};


// User.deleteMany({ age: { $gte: 15 } }).then(function () {
//     console.log("Data deleted"); // Success
// }).catch(function (error) {
//     console.log(error); // Failure
// });
