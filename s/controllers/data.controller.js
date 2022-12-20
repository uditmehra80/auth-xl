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
const FilteredData = ({ DataArr, startDate, endDate, period }) => {

    // console.log("PERIOD+++" + period)

    // Set the start and end dates
    var start = new Date(startDate);
    var end = new Date(endDate);

    // console.log(start < end);
    // Get the month and year for each date
    var startMonth = start.getMonth();
    var startYear = start.getFullYear();
    var endMonth = end.getMonth();
    var endYear = end.getFullYear();

    var Interval;

    if (period === "weekly") {
        const diff = end.getTime() - start.getTime();
        Interval = Math.round((diff / 604800000) + 1);
    } else {
        //  Calculate the difference in months
        var diffMonths = (endYear - startYear) * 12 + (endMonth - startMonth);
        var totalNoMonths = diffMonths;
        Interval = Math.round(totalNoMonths / period);
        // console.log(Interval);
    }

    let array = [];

    let formatStartDate = new Date(startDate);

    // let formatStartDate = format(new Date(startDate), "MM-dd-yyyy");
    // console.log("no of Interation===" + Interval)


    for (let i = 0; i <= Interval; i++) {

        let firstDate = new Date(formatStartDate);
        let formatEndDate;


        if (period === "weekly") {
            firstDate.setDate(firstDate.getDate() + 7 * i);
            const nextDate = new Date(firstDate);
            nextDate.setDate(nextDate.getDate() + 7);

            // console.log(nextDate);
            formatEndDate = new Date(nextDate);

        } else {
            var m = firstDate.getMonth() + period * i;
            firstDate.setMonth(m);
            const nextDate = new Date(firstDate);
            var month = nextDate.getMonth() + period;
            nextDate.setMonth(month);
            formatEndDate = new Date(nextDate);
        }

        // console.log("startDate=" + format(new Date(startDate), "dd-MM-yyyy"));
        // console.log("endDate=" + format(new Date(endDate), "dd-MM-yyyy"));

        // console.log(
        //     "End-Loop-Date= " + format(new Date(formatEndDate), "dd-MM-yyyy")
        // );

        if (
            new Date(formatEndDate) > new Date(endDate)
        ) {
            formatEndDate = new Date(endDate);
        }

        if (
            new Date(endDate) > new Date(firstDate) === false
        ) {
            // console.log(array);
            return array;
        }

        let Result = DataArr.filter((data) => {
            const d = new Date(data.date);
            return (
                // moment(data.date).isSameOrAfter(firstDate) &&
                // moment(data.date).isSameOrBefore(formatEndDate)
                new Date(firstDate) <= d && d <= new Date(formatEndDate)
            );
        });

        let arryOfValue = [];
        console.log("DATA== " + Result.length)
        Result.map((data) => {
            arryOfValue.push(Number(data.value));
        });

        // let obj = {
        //     from: format(new Date(firstDate), "dd-MM-yyyy"),
        //     to: format(new Date(formatEndDate), "dd-MM-yyyy"),
        //     data: arryOfValue.reduce(
        //         (total, currentValue) => total + currentValue,
        //         0
        //     ),
        // };

        const formatEndDate_1 = new Date(formatEndDate);
        formatEndDate_1.setDate(formatEndDate_1.getDate() - 1);

        let obj = {
            from: format(new Date(firstDate), "dd-MM-yyyy"),
            to: format(new Date(formatEndDate_1), "dd-MM-yyyy"),
            data: arryOfValue.reduce(
                (total, currentValue) => total + currentValue,
                0
            ),
        };

        array.push(obj);
        if (i === Interval) {
            // console.log(array);
            return array;
        }
    }

};

function isValidDate(dateString) {
    // Use the Date.parse method to check if the date string is a valid date
    const date = Date.parse(dateString);
    // If the date is not NaN, it is a valid date
    return !isNaN(date);
}

exports.getSpecificData = async (req, res) => {

    console.log(req.body)

    let { tableName, periodName } = req.body;

    if (!req.body.startDate) {
        res.status(200).json({
            status: 200,
            message: 'please select date in format of MM-dd-yyyy',
            ArrObj: []
        });
        return false;
    }

    if (isValidDate(req.body.startDate) === false) {
        res.status(200).json({
            status: 200,
            message: 'Invalid date format use MM-dd-yyyy',
            ArrObj: []
        });
        return false;
    }

    // let startDate = format(new Date(req.body.startDate), "MM-dd-yyyy");
    let startDate = new Date(req.body.startDate);
    // const startDate = new Date(startDate1);
    // startDate.setDate(startDate.getDate() + 1);
    // console.log(startDate1);
    console.log(startDate);

    if (!tableName) {
        res.status(200).json({
            status: 200,
            message: 'please select tableName',
            ArrObj: []
        });
        return false;
    }

    if (!periodName) {
        res.status(200).json({
            status: 200,
            message: 'please select periodName',
            ArrObj: []
        });
        return false;
    }

    let period = null;

    if (periodName === "monthly") {
        period = 1
    }
    else if (periodName === "quarterly") {
        period = 3
    }
    else if (periodName === "annually") {
        period = 12
    } else if (periodName === "weekly") {
        period = "weekly"
    } else {
        res.status(200).json({
            status: 200,
            message: 'periodName must be weekly, monthly , quarterly , annually',
            ArrObj: []
        });
        return false;
    }

    let date = new Date();
    let dateOneBefore = new Date(date);
    let endDate = new Date(
        dateOneBefore.setDate(dateOneBefore.getDate() + 1)
    );

    let dataTable = await DataTable.exists({ title: tableName.toLowerCase() });
    if (!dataTable) {
        res.status(200).json({
            status: 200,
            message: 'no data found with this tableName',
            ArrObj: []
        });
        return false;
    }

    try {
        const DataArr = await Data.find({
            dataTable_Id: dataTable?._id,
            date: { $gte: startDate, $lte: endDate }
        });

        // console.log("DataArr")
        console.log(DataArr.length)

        if (DataArr.length > 0) {
            const ArrObj = await FilteredData({ DataArr, startDate, endDate, period });
            // console.log("ArrObj")
            // console.log(ArrObj.length)
            if (ArrObj.length > 0) {
                res.status(200).json({
                    status: 200,
                    message: 'Datas showing format of DD/MM/YYYY',
                    ArrObj
                });
            } else {
                res.status(200).json({
                    status: 200,
                    message: 'some problem with Data filter',
                    ArrObj: []
                });
            }
        } else {
            res.status(200).json({
                status: 200,
                message: 'No filter data found bw dates',
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



