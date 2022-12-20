import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import Button from "@mui/material/Button";
import { Link, Navigate, useNavigate } from "react-router-dom";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import Stack from "@mui/material/Stack";
import format from "date-fns/format";
import axios from "axios";
import GetFiles from "./GetFiles";
import DataTables from "./DataTables";
import Progress from "./Progress";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, signup_user } from "../features/userSlice";
import { logout } from "../features/userSlice";
import CircularProgress from "@mui/material/CircularProgress";
import { ToastContainer, toast } from "material-react-toastify";
import DatePickers from "./DatePickers";

export default function Upload() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const handlelogout = (event) => {
    dispatch(logout());
  };
  let userData = JSON.parse(localStorage.getItem("user-detail"));

  const [dataTables, setDataTables] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadData, setLoadData] = useState(0);

  const [errorMsg, setErrorMsg] = useState("");

  let eventArr = [];
  let FieldName = "";
  let FieldNameArray = "";

  let file_id = "";

  const PostData = async (ArrWithId) => {
    setLoading(true);
    await axios({
      url: `${process.env.REACT_APP_API_URL}/api/upload-data`,
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
        Authorization: JSON.parse(localStorage.getItem("user")).token,
      },
    })
      .then(function (res) {
        // console.log(res.data);
        setLoading(false);
        setLoadData((prev) => prev + 1);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
        setErrorMsg(`internal server error please try again later`);
        return false;
      });
  };

  const PostTable = async ({ title, file_id, data }) => {
    setLoading(true);
    const TableData = {
      title: title.toLowerCase().trim(),
      file_id,
      data,
    };
    const fileRes = await axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/upload-dataTable`,
        TableData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: JSON.parse(localStorage.getItem("user")).token,
          },
        }
      )
      .then(function async(res) {
        // console.log(res.data);
        if (res.data.result._id) {
          let ArrWithId = data.map((obj) => {
            obj.dataTable_Id = res.data.result._id;
            return obj;
          });
          toast.success(res.data.message, {
            position: "bottom-right",
            autoClose: 10000,
            hideProgressBar: false,
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
    setLoading(true);

    const FileData = {
      filename,
      description,
      referenceId,
    };

    const fileRes = await axios
      .post(`${process.env.REACT_APP_API_URL}/api/upload-file`, FileData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: JSON.parse(localStorage.getItem("user")).token,
        },
      })
      .then(function (res) {
        // console.log(res.data);
        file_id = res.data.result._id;
        if (res.data.result._id) {
          if (
            eventArr.length !== 0 &&
            eventArr.length === FieldNameArray.length
          ) {
            eventArr.map((datas, i) => {
              PostTable({
                title: FieldNameArray[i],
                file_id: res.data.result._id,
                data: datas,
              });
            });
          } else {
            setLoading(false);
            setErrorMsg(`please try again later`);
            return false;
          }
        } else {
          setLoading(false);
          setErrorMsg(`internal server error please try again later`);
          return false;
        }
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
        setErrorMsg(error.response?.data?.error);
        dispatch(logout());
        return false;
      });
  };

  const readExcel = (file) => {
    eventArr = [];
    FieldName = "";
    FieldNameArray = "";
    file_id = "";

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
        // console.log(wb);
        description = wb.Props;

        const excelData = Object.values(wb.Sheets);
        // console.log(excelData);
        let LoopStatus = true;

        excelData.forEach((sheet, ind, ExlArr) => {
          let arrayOfPerSheetData = [];

          const wsname = wb.SheetNames[ind];
          const ws = wb.Sheets[wsname];
          // console.log(ws);
          // console.log(sheet);
          const datas = XLSX.utils.sheet_to_json(ws);
          resolve(datas);

          // console.log(wb.SheetNames[ind]);

          // console.log(datas);
          FieldNameArray = wb.SheetNames;
          FieldName = wb.SheetNames[ind];

          datas.map((data, index, arr) => {
            // console.log(index);
            // console.log(datas[index]);
            // console.log(wb.SheetNames[index]);
            if (LoopStatus) {
              if (!datas[1].hasOwnProperty("date")) {
                setLoading(false);
                setErrorMsg(
                  `date field is missing at table name= ${wb.SheetNames[ind]}`
                );
                LoopStatus = false;
                return false;
              } else if (!datas[1].hasOwnProperty("value")) {
                setLoading(false);
                setErrorMsg(
                  `value field is missing at table name= ${wb.SheetNames[ind]}`
                );
                LoopStatus = false;
                return false;
              } else {
                if (data.date === null) {
                  setLoading(false);
                  setErrorMsg(
                    `date field is empty at row no = ${index + 2} table name= ${
                      wb.SheetNames[ind]
                    }`
                  );
                  LoopStatus = false;
                  return false;
                } else if (data.value === null) {
                  setLoading(false);
                  setErrorMsg(
                    `value field is empty at row no = ${
                      index + 2
                    } table name= ${wb.SheetNames[ind]}`
                  );
                  LoopStatus = false;
                  return false;
                } else if (typeof data.value !== "number") {
                  setLoading(false);
                  setErrorMsg(
                    `please provide valid value "like number not text" at row no = ${
                      index + 2
                    } table name= ${wb.SheetNames[ind]}`
                  );
                  LoopStatus = false;
                  return false;
                } else if (
                  typeof data.date === "string" ||
                  typeof data.date === "number" ||
                  data.date == "Invalid Date"
                ) {
                  setLoading(false);
                  setErrorMsg(
                    `please provide valid date at row no = ${
                      index + 2
                    } table name= ${wb.SheetNames[ind]}`
                  );
                  LoopStatus = false;
                  return false;
                } else {
                  let date = new Date(data.date);
                  let dateOneBefore = new Date(date);
                  let currentDate = new Date(
                    dateOneBefore.setDate(dateOneBefore.getDate() + 1)
                  );

                  arrayOfPerSheetData.push({
                    title: FieldName,
                    date: currentDate,
                    value: data.value,
                  });

                  if (index === arr.length - 1) {
                    // console.log(arrayOfPerSheetData);
                    eventArr.push(arrayOfPerSheetData);
                    arrayOfPerSheetData = [];
                    // console.log(eventArr);
                  }

                  if (ind === ExlArr.length - 1 && index === arr.length - 1) {
                    PostFile({
                      filename,
                      description,
                      referenceId,
                    }).then(() => {
                      eventArr = [];
                    });
                  }
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

          <DataTables
            loadData={loadData}
            loading={loading}
            setLoading={setLoading}
            setLoadData={setLoadData}
            errorMsg={errorMsg}
            setErrorMsg={setErrorMsg}
            dataTables={dataTables}
            setDataTables={setDataTables}
          />
          {/* <GetFiles
            loadData={loadData}
            loading={loading}
            setLoading={setLoading}
            setLoadData={setLoadData}
          /> */}
          <ToastContainer />
          {dataTables.length > 0 && (
            <DatePickers
              dataTables={dataTables}
              setLoading={setLoading}
              loadData={loadData}
            />
          )}
        </div>
      )}
    </>
  );
}
