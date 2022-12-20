import React, { useEffect, useState, useDeferredValue } from "react";
import { Link, useParams } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/userSlice";

function DataTables({
  loadData,
  setLoadData,
  errorMsg,
  setErrorMsg,
  dataTables,
  setDataTables,
  loading,
  setLoading,
}) {
  const dispatch = useDispatch();

  const deferredValue = useDeferredValue(loadData);

  const getDataTable = async () => {
    // console.log("DataTable");

    setLoading(true);
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/get-dataTable`
    );
    let data = await response.json();
    setDataTables(data.data);
    setLoading(false);
    return data;
  };

  useEffect(() => {
    getDataTable();
  }, [deferredValue]);

  async function deletePost(id) {
    setLoading(true);
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/delete-dataTable/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: JSON.parse(localStorage.getItem("user")).token,
        },
        method: "DELETE",
      }
    );
    const data = await response.json();
    // console.log(data);
    setErrorMsg(data.error);
    if (data.error) {
      dispatch(logout());
    }
    setLoadData((prev) => prev + 1);
    setLoading(false);
  }

  return (
    <>
      {/* {dataTables.length > 0 && (
        <div className="d-flex justify-content-between mb-1">
          <h4 className="mt-3">Total no of Tables = {dataTables.length}</h4>
          <Link className="btn btn-secondary" to="/">
            Back to dashboard
          </Link>
        </div>
      )} */}
      {dataTables.length !== 0 ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell align="left">Table Name</TableCell>
                <TableCell align="left">Updated from file</TableCell>
                <TableCell align="left">Created at</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataTables?.map((datatable, index) => (
                <TableRow
                  key={datatable._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell align="left">{datatable.title}</TableCell>
                  <TableCell align="left">
                    {datatable?.file_id?.filename}
                  </TableCell>
                  <TableCell align="left">{datatable.created_at}</TableCell>
                  <TableCell align="right">
                    <Stack
                      direction="row"
                      spacing={2}
                      display="flex"
                      justifyContent="end"
                    >
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => deletePost(datatable._id)}
                        disabled={loading}
                      >
                        DELETE
                      </Button>
                      <Link
                        className="btn btn-dark"
                        to={`/datas/${datatable._id}`}
                        disabled={loading}
                      >
                        VIEW
                      </Link>
                      {/* 
                      <Button variant="contained" color="warning">
                        EDIT
                      </Button> */}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <h4>PLEASE UPLOAD FILE, TABLES NOT FOUND</h4>
      )}
    </>
  );
}

export default DataTables;
