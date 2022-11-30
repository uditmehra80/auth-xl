import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import Button from "@mui/material/Button";
import { Link, Navigate, useNavigate } from "react-router-dom";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import Stack from "@mui/material/Stack";
import format from "date-fns/format";
import axios from "axios";
import GetFiles from "./GetFiles";
import Progress from "./Progress";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, signup_user } from "../features/userSlice";
import { logout } from "../features/userSlice";
import CircularProgress from "@mui/material/CircularProgress";

export default function Upload() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const handlelogout = (event) => {
    dispatch(logout());
  };
  let userData = JSON.parse(localStorage.getItem("user-detail"));

  const [loading, setLoading] = useState(false);
  const [loadData, setLoadData] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");

  let eventArr1 = [];
  let eventArr2 = [];
  let eventArr3 = [];
  let eventArr4 = [];

  let file_id = "";

  const PostData = async (ArrWithId) => {
    await axios({
      url: "http://localhost:3001/api/upload-data",
      method: "POST",
      data: JSON.stringify(ArrWithId),
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        let percentCompleted = Math.round((loaded * 100) / total);
        // console.log(percentCompleted);
        // console.log(`${loaded}kb of ${total}kb | ${percentCompleted}`);
      },
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(function (res) {
        // console.log(res.data);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
        setErrorMsg(`internal server error please try again later`);
        return false;
      });
    setLoadData(true);
  };

  const PostTable = async ({ title, file_id, data }) => {
    const TableData = {
      title,
      file_id,
      data,
    };
    const fileRes = await axios
      .post("http://localhost:3001/api/upload-dataTable", TableData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(function async(res) {
        // console.log(res.data);
        if (res.data.result._id) {
          let ArrWithId = data.map((obj) => {
            obj.dataTable_Id = res.data.result._id;
            return obj;
          });
          PostData(ArrWithId);
        } else {
          setLoading(false);
          setErrorMsg(`internal server error please try again later`);
          return false;
        }
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
        setErrorMsg(`internal server error please try again later`);
        return false;
      });
  };

  const PostFile = async ({ filename, description, referenceId }) => {
    const FileData = {
      filename,
      description,
      referenceId,
    };

    const fileRes = await axios
      .post("http://localhost:3001/api/upload-file", FileData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(function (res) {
        // console.log(res.data);
        file_id = res.data.result._id;
        if (res.data.result._id) {
          PostTable({
            title: `Manufacturers' New Orders: Durable Goods`,
            file_id: res.data.result._id,
            data: eventArr1,
          });
          PostTable({
            title: `Manufacturers' Value of Shipments: Durable Goods`,
            file_id: res.data.result._id,
            data: eventArr2,
          });
          PostTable({
            title: `Manufacturers' New Orders: Consumer Durable Goods`,
            file_id: res.data.result._id,
            data: eventArr3,
          });
          PostTable({
            title: `Manufacturers' Value of Shipments: Consumer Durable Goods`,
            file_id: res.data.result._id,
            data: eventArr4,
          });
        } else {
          setLoading(false);
          setErrorMsg(`internal server error please try again later`);
          return false;
        }
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
        setErrorMsg(`internal server error please try again later`);
        return false;
      });
  };

  const readExcel = (file) => {
    setLoading(true);
    setErrorMsg("");
    // console.log(file);
    let referenceId = Math.random().toString(16).slice(4);

    let filename = file.name;
    let description;

    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) => {
        // console.log(e);

        const bufferArray = e.target.result;
        // console.log(bufferArray);

        const wb = XLSX.read(bufferArray, {
          type: "buffer",
          cellDates: true,
          dateNF: "MM-DD-YYYY;@",
        });
        // console.log(wb.Props);
        description = wb.Props;

        const excelData = Object.values(wb.Sheets);
        // console.log(excelData);

        excelData.forEach((sheet, index) => {
          const wsname = wb.SheetNames[index];
          const ws = wb.Sheets[wsname];

          // console.log(ws);

          const datas = XLSX.utils.sheet_to_json(ws);
          resolve(datas);
          // console.log(datas);

          // console.log(ws.D2.v);
          // console.log(ws.D3.v);
          // console.log(datas);

          datas.forEach((data, index, arr) => {
            // console.log(datas[index]);
            if (
              !datas[1].hasOwnProperty("date1") ||
              !datas[1].hasOwnProperty("value1") ||
              !datas[1].hasOwnProperty("date2") ||
              !datas[1].hasOwnProperty("value2") ||
              !datas[1].hasOwnProperty("date3") ||
              !datas[1].hasOwnProperty("value3") ||
              !datas[1].hasOwnProperty("date4") ||
              !datas[1].hasOwnProperty("value4")
            ) {
              if (index === 1) {
                setLoading(false);
                setErrorMsg("one of field is missing");
                return false;
              }
            } else {
              if (data.date1 == null) {
                setLoading(false);
                setErrorMsg(`date1 field is empty at row no = ${index + 2}`);
                return false;
              } else if (data.value1 == null) {
                setLoading(false);
                setErrorMsg(`value1 field is empty at row no = ${index + 2}`);
                return false;
              } else if (data.date2 == null) {
                setLoading(false);
                setErrorMsg(`date2 field is empty at row no = ${index + 2}`);
                return false;
              } else if (data.value2 == null) {
                setLoading(false);
                setErrorMsg(`value2 field is empty at row no = ${index + 2}`);
                return false;
              } else if (data.date3 == null) {
                setLoading(false);
                setErrorMsg(`date3 field is empty at row no = ${index + 2}`);
                return false;
              } else if (data.value3 == null) {
                setLoading(false);
                setErrorMsg(`value3 field is empty at row no = ${index + 2}`);
                return false;
              } else if (data.date4 == null) {
                setLoading(false);
                setErrorMsg(`date4 field is empty at row no = ${index + 2}`);
                return false;
              } else if (data.value4 == null) {
                setLoading(false);
                setErrorMsg(`value4 field is empty at row no = ${index + 2}`);
                return false;
              } else {
                console.log("Final test pass");

                let date1 = format(new Date(data.date1), "MM-dd-yyyy");
                let dateOneBefore1 = new Date(date1);
                let currentDate1 = new Date(
                  dateOneBefore1.setDate(dateOneBefore1.getDate() + 1)
                );
                let dateFormat1 = format(new Date(currentDate1), "dd-MM-yyyy");

                let date2 = format(new Date(data.date2), "MM-dd-yyyy");
                let dateOneBefore2 = new Date(date2);
                let currentDate2 = new Date(
                  dateOneBefore2.setDate(dateOneBefore2.getDate() + 1)
                );
                let dateFormat2 = format(new Date(currentDate2), "dd-MM-yyyy");

                let date3 = format(new Date(data.date3), "MM-dd-yyyy");
                let dateOneBefore3 = new Date(date3);
                let currentDate3 = new Date(
                  dateOneBefore3.setDate(dateOneBefore3.getDate() + 1)
                );
                let dateFormat3 = format(new Date(currentDate3), "dd-MM-yyyy");

                let date4 = format(new Date(data.date4), "MM-dd-yyyy");
                let dateOneBefore4 = new Date(date4);
                let currentDate4 = new Date(
                  dateOneBefore4.setDate(dateOneBefore4.getDate() + 1)
                );
                let dateFormat4 = format(new Date(currentDate4), "dd-MM-yyyy");

                eventArr1.push({
                  title: `Manufacturers' New Orders: Durable Goods`,
                  date: dateFormat1,
                  value: data.value1,
                });
                eventArr2.push({
                  title: `Manufacturers' Value of Shipments: Durable Goods`,
                  date: dateFormat2,
                  value: data.value2,
                });
                eventArr3.push({
                  title: `Manufacturers' New Orders: Consumer Durable Goods`,
                  date: dateFormat3,
                  value: data.value3,
                });
                eventArr4.push({
                  title: `Manufacturers' Value of Shipments: Consumer Durable Goods`,
                  date: dateFormat4,
                  value: data.value4,
                });

                if (index === arr.length - 1) {
                  PostFile({
                    filename,
                    description,
                    referenceId,
                  });
                }
              }
            }
            // console.log(data)
            // console.log(data.Date);
            // console.log(data["Date"]);
          });
        });
      };
    });
  };

  return (
    <>
      {!user ? (
        <Navigate to="/login" />
      ) : (
        <div>
          <div>
            {loading && <Progress />}
            <div className="d-flex justify-content-end mt-2">
              {!loading ? (
                <Button
                  variant="contained"
                  component="label"
                  endIcon={<DriveFolderUploadIcon />}
                >
                  Upload V3
                  <input
                    accept=".xlsx, .xls"
                    id="import-data"
                    type="file"
                    onClick={(event) => {
                      event.target.value = null;
                    }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      readExcel(file);
                    }}
                    hidden
                  />
                </Button>
              ) : (
                <Button variant="contained" disabled>
                  Please wait..
                </Button>
              )}

              {/* {userData && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={(event) => handlelogout(event)}
                  className="ml-2"
                >
                  LOGOUT
                </Button>
              )} */}
            </div>
          </div>
          {errorMsg && (
            <span
              className="d-flex justify-content-end"
              style={{
                color: "#ef5350",
                fontWeight: "500",
              }}
            >
              {errorMsg}
            </span>
          )}

          <GetFiles loadData={loadData} />
        </div>
      )}
    </>
  );
}
