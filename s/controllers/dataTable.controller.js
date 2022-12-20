const DataTable = require("../model/dataTableSchema");
const Data = require("../model/dataSchema");
const File = require("../model/fileSchema");

exports.getAllDataTable = async function (req, res) {
    // const users = await User.find({}).populate('pages').populate('projects')
    //     .then(async (users) => {
    //         if (!users) {
    //             return res
    //                 .status(404)
    //                 .json({ status: false, error: "no users found" });
    //         }
    //         else {
    //             return res
    //                 .status(200)
    //                 .json({ status: true, users });
    //         }
    //     })
    //     .catch((err) => {
    //         res.send("error" + err)
    //     });
    try {
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
        ).populate('file_id');
    } catch (err) {
        res.send("error" + err)
    }
};

exports.getDataTables = function (req, res) {
    try {

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
    } catch (err) {
        res.send("error" + err)
    }
};

exports.getAllDataTableTerm = async function (req, res) {
    const { term } = req.query

    try {
        let datatables = [];
        let table_Names = [];


        if (!term) datatables = await DataTable.find({});
        else datatables = await DataTable.find({ title: { $regex: term } });

        datatables.map((data) => {
            table_Names.push(data.title)
        })

        res.status(200).json({
            status: 200,
            table_Names,
        });
    } catch (err) {
        res.send("error" + err)
    }

};

exports.uploadDataTable = async (request, response) => {
    const DataObj = request.body;

    try {
        DataTable.find(
            { title: request.body.title },
            async function (err, tables) {
                if (tables.length > 0) {

                    tables.map(async (table) => {
                        Data.find(
                            { dataTable_Id: table._id },
                            function (err, datas) {
                                datas.map((data) => {
                                    data.remove();
                                })
                            }
                        );
                        table.remove();
                        Data.deleteMany({ dataTable_Id: table._id })
                    });

                    const dataTable1 = await DataTable.find({ file_id: tables[0].file_id })
                    if (dataTable1.length === 0) {
                        await File.deleteOne({ _id: tables[0].file_id });
                        console.log('Deleted File also')
                    }

                    const result = await DataTable(DataObj).save();
                    response.send({
                        message: `Replaced datatable with name of = ${request.body.title}`,
                        result: result,
                    });

                } else {
                    const result = await DataTable(DataObj).save();
                    response.send({
                        message: `Posted datatable with name of = ${request.body.title}`,
                        result: result,
                    });
                }

            }
        )
    } catch (err) {
        response.send("error" + err)
    }

    // const filter = { title: request.body.title };
    // const update = { data: request.body.data };

    // let existingTable = await DataTable.findOneAndUpdate(filter, update);

    // if (existingTable) {
    //     await Data.deleteMany({ dataTable_Id: existingTable._id });
    //     response.send({
    //         message: `Replaced datatable with name of = ${request.body.title}`,
    //         result: existingTable,
    //     });
    // } else {
    //     const result = await DataTable(DataObj).save();
    //     response.send({
    //         message: `Posted datatable with name of = ${request.body.title}`,
    //         result: result,
    //     });
    // }

};

exports.deleteDataTable = async (req, res) => {

    try {
        const dataTable = await DataTable.find({ _id: req.params.id })
        const dataTable1 = await DataTable.find({ file_id: dataTable[0].file_id })
        if (dataTable1.length === 1) {
            await File.deleteOne({ _id: dataTable[0].file_id });
            console.log('Deleted File also')
        }

        DataTable.find(
            { _id: req.params.id },
            function (err, tables) {
                tables.map(async (table) => {
                    table.remove();
                    Data.find(
                        { dataTable_Id: table._id },
                        function (err, datas) {
                            datas.map((data) => {
                                data.remove();
                            })
                        }
                    );
                    Data.deleteMany({ dataTable_Id: table._id })
                })
                res.status(200).json({
                    status: 200,
                    message: 'datatable deleted ',
                });
            }
        );

    } catch (err) {
        res.send("error" + err);
        console.log(err)
    }
};
