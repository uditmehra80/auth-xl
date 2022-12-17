import React, { useState } from "react";
import format from "date-fns/format";
import axios from "axios";
import moment from "moment";
import { useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function DatePickers({ loadData, setLoading, dataTables }) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedTable, setSelectedTable] = useState("");
  const [period, setPeriod] = useState();
  const [errMsg, setErrMsg] = useState("");

  const [ArrObj, setArrObj] = useState([]);

  useEffect(() => {
    // console.log("dataTables Change");
    setErrMsg("");
    setSelectedTable("");
    setPeriod(0);
    setArrObj([]);
  }, [dataTables]);

  const GetDateFilter = async () => {
    setErrMsg("");
    setLoading(true);

    if (moment(new Date(startDate)).isAfter(moment(new Date(endDate)))) {
      setErrMsg("end date should be greater than start date");
      setLoading(false);
      setArrObj([]);

      return;
    }
    if (!selectedTable) {
      setErrMsg("please select a table");
      setLoading(false);
      setArrObj([]);

      return;
    }
    if (!period || period == 0) {
      setErrMsg("please select a time period");
      setLoading(false);
      setArrObj([]);

      return;
    }

    const Data = {
      startDate: startDate && format(new Date(startDate), "MM-dd-yyyy"),
      endDate: endDate && format(new Date(endDate), "MM-dd-yyyy"),
      selectedTable,
      period,
    };

    const fileRes = await axios
      .post(`${process.env.REACT_APP_API_URL}/api/get-specific-data`, Data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(function async(res) {
        // console.log(res.data);
        setArrObj(res?.data?.ArrObj);
        if (res?.data?.ArrObj.length === 0) {
          setErrMsg("No data found with these selected date");
          setLoading(false);
        }
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
        setErrMsg("Network error");
        return false;
      });
  };

  return (
    <>
      <div className="table-responsive">
        <table
          style={{
            minWidth: "709px",
          }}
          className="table"
        >
          <thead>
            <tr>
              <th scope="col">
                <DatePicker
                  placeholderText="choose start date"
                  value={startDate}
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                  showMonthDropdown
                  showYearDropdown
                />
              </th>
              <th scope="col">
                <DatePicker
                  placeholderText="choose end date"
                  value={endDate}
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                  showMonthDropdown
                  showYearDropdown
                />
              </th>
              <th scope="col">
                <select
                  onChange={(e) => setSelectedTable(e.target.value)}
                  className="form-select"
                  aria-label="Default select example"
                  value={selectedTable}
                >
                  <option value={""}>Select table</option>
                  {dataTables.map((table, i) => {
                    return (
                      <option key={i} value={table._id}>
                        {table.title}
                      </option>
                    );
                  })}
                </select>
              </th>

              <th scope="col">
                <select
                  onChange={(e) => setPeriod(Number(e.target.value))}
                  className="form-select"
                  aria-label="Default select example"
                  value={period}
                >
                  <option value={0}>Select period</option>
                  <option value={3}>3 months</option>
                  <option value={6}>6 months</option>
                  <option value={12}>12 months</option>
                </select>
              </th>
              <th scope="col">
                <button className="btn w-100 btn-dark" onClick={GetDateFilter}>
                  Submit
                </button>
              </th>
            </tr>
          </thead>
        </table>
      </div>
      {errMsg && <span className="text-danger">{errMsg}</span>}
      {ArrObj.length > 0 && (
        <div className="table-responsive">
          <table
            style={{
              minWidth: "709px",
            }}
            className="table"
          >
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">From</th>
                <th scope="col">To</th>
                <th scope="col">Data</th>
              </tr>
            </thead>
            <tbody>
              {ArrObj.map((data, i) => {
                return (
                  <tr key={i}>
                    <th scope="row">{i + 1}</th>
                    <td>{data.from}</td>
                    <td>{data.to}</td>
                    <td>{data.data}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
export default DatePickers;
