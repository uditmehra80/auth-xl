const Data = require("../model/dataSchema");
const DataTable = require("../model/dataTableSchema");

const format = require("date-fns/format");
const moment = require("moment");

exports.getAllData = function (req, res) {
    try {
        Data.find({},
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
    } catch (err) {
        res.send("error" + err);
        console.log(err)
    }
};
const FilteredData = ({ DataArr, startDate, endDate, selectedTable, period }) => {

    // Set the start and end dates
    var start = new Date(startDate);
    var end = new Date(endDate);
    // console.log(start < end);
    // Get the month and year for each date
    var startMonth = start.getMonth();
    var startYear = start.getFullYear();
    var endMonth = end.getMonth();
    var endYear = end.getFullYear();
    //  Calculate the difference in months
    var diffMonths = (endYear - startYear) * 12 + (endMonth - startMonth);
    var totalNoMonths = diffMonths;
    var MonthsInterval = Math.round(totalNoMonths / period);
    // console.log(MonthsInterval);

    let array = [];

    for (let i = 0; i <= MonthsInterval; i++) {
        let formatStartDate = format(new Date(startDate), "MM-dd-yyyy");
        const firstDate = new Date(formatStartDate);
        // Get the current month (0-11) and add period to it
        var m = firstDate.getMonth() + period * i;
        // Set the new month on the date object
        firstDate.setMonth(m);

        // console.log("firstDate=" + format(new Date(firstDate), "dd-MM-yyyy"));
        // Get the current date
        const nextDate = new Date(firstDate);
        // Get the current month (0-11) and add period to it
        var month = nextDate.getMonth() + period;
        // Set the new month on the date object
        nextDate.setMonth(month);
        //set - 1 day
        nextDate.setDate(nextDate.getDate() - 1);
        // console.log(nextDate);
        let formatEndDate = format(new Date(nextDate), "MM-dd-yyyy");
        // console.log(
        //   "formatEndDate=" + format(new Date(formatEndDate), "dd-MM-yyyy")
        // );
        // console.log("startDate=" + format(new Date(startDate), "dd-MM-yyyy"));
        // console.log("endDate=" + format(new Date(endDate), "dd-MM-yyyy"));

        if (
            moment(new Date(formatEndDate)).isAfter(moment(new Date(endDate)))
        ) {
            formatEndDate = new Date(endDate);
        }

        if (
            moment(new Date(endDate)).isAfter(moment(new Date(firstDate))) ===
            false
        ) {
            // console.log(array);
            return array;
        }

        let Result = DataArr.filter((data) => {
            return (
                moment(data.date).isSameOrAfter(firstDate) &&
                moment(data.date).isSameOrBefore(formatEndDate)
            );
        });
        let arryOfValue = [];
        Result.map((data) => {
            arryOfValue.push(Number(data.value));
        });

        let obj = {
            from: format(new Date(firstDate), "dd-MM-yyyy"),
            to: format(new Date(formatEndDate), "dd-MM-yyyy"),
            data: arryOfValue.reduce(
                (total, currentValue) => total + currentValue,
                0
            ),
        };

        array.push(obj);
        if (i === MonthsInterval) {
            // console.log(array);
            return array;
        }
    }

};

exports.getSpecificData = async (req, res) => {

    console.log(req.body)

    const { startDate, endDate, selectedTable, period, tableName } = req.body;

    let dataTable
    if (tableName) {
        dataTable = await DataTable.exists({ title: tableName.toLowerCase() });
        console.log(dataTable._id)
    }

    try {
        const DataArr = await Data.find({
            dataTable_Id: selectedTable ? selectedTable : dataTable?._id,
            date: { $gte: startDate, $lte: endDate },
        });

        if (DataArr.length > 0) {
            const ArrObj = await FilteredData({ DataArr, startDate, endDate, period });
            console.log(ArrObj)
            if (ArrObj.length > 0) {
                res.status(200).json({
                    status: 200,
                    ArrObj
                });
            } else {
                res.status(200).json({
                    status: 200,
                    ArrObj: []
                });
            }
        } else {
            res.status(200).json({
                status: 200,
                ArrObj: []
            });
        }
    } catch (err) {
        res.send("error" + err);
        console.log(err)
    }
};

exports.getDatas = function (req, res) {
    try {
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
    } catch (err) {
        res.send("error" + err);
        console.log(err)
    }
};

exports.uploadData = async (req, res) => {
    try {
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
    } catch (err) {
        res.send("error" + err);
        console.log(err)
    }
};



