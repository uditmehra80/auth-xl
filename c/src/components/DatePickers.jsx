import React, { useState } from "react";
import format from "date-fns/format";
import axios from "axios";
import moment from "moment";
import { useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function DatePickers({ loadData, setLoading, dataTables }) {
  const [startDate, setStartDate] = useState();
  // const [endDate, setEndDate] = useState(new Date());
  const [selectedTable, setSelectedTable] = useState("");
  const [period, setPeriod] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const [ArrObj, setArrObj] = useState([]);

  // console.log(startDate);
  // console.log(format(new Date(startDate), "MM-dd-yyyy"));

  useEffect(() => {
    // console.log("dataTables Change");
    setErrMsg("");
    setSelectedTable("");
    setPeriod("");
    setArrObj([]);
  }, [dataTables]);

  const GetDateFilter = async () => {
    setErrMsg("");
    setLoading(true);

    if (!startDate) {
      setErrMsg("please select starting date");
      setLoading(false);
      setArrObj([]);

      return;
    }
    if (!selectedTable) {
      setErrMsg("please select tableName");
      setLoading(false);
      setArrObj([]);

      return;
    }
    if (!period || period === "") {
      setErrMsg("please select periodName");
      setLoading(false);
      setArrObj([]);

      return;
    }

    const Data = {
      startDate: format(new Date(startDate), "yyyy-MM-dd"),
      // endDate: new Date(endDate),
      tableName: selectedTable,
      periodName: period,
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
                  placeholderText="choose start date ( YYYY/MM/DD )"
                  value={startDate}
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="yyyy/MM/dd"
                  className="form-control"
                  showMonthDropdown
                  showYearDropdown
                />
                {/* <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  dateFormat="MM/dd/yyyy"
                /> */}
              </th>
              {/* <th scope="col">
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
              </th> */}
              <th scope="col">
                <select
                  onChange={(e) => setSelectedTable(e.target.value)}
                  className="form-select"
                  aria-label="Default select example"
                  value={selectedTable}
                >
                  <option value={""}>tableName</option>
                  {dataTables.map((table, i) => {
                    return (
                      <option key={i} value={table.title}>
                        {table.title}
                      </option>
                    );
                  })}
                </select>
              </th>

              <th scope="col">
                <select
                  onChange={(e) => setPeriod(e.target.value)}
                  className="form-select"
                  aria-label="Default select example"
                  value={period}
                >
                  <option value="">periodName</option>
                  <option value="weekly">weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">quarterly</option>
                  <option value="annually">Annually </option>
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
                <th scope="col">
                  From
                  <small
                    style={{
                      fontSize: "10px",
                      color: "gray",
                    }}
                  >
                    ( DD/MM/YYYY )
                  </small>
                </th>
                <th scope="col">
                  To
                  <small
                    style={{
                      fontSize: "10px",
                      color: "gray",
                    }}
                  >
                    ( DD/MM/YYYY )
                  </small>
                </th>
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
