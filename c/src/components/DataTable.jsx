import React, { useEffect, useState } from "react";
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

function DataTable(props) {
  let { id } = useParams();
  const [dataTables, setDataTables] = useState([]);

  const getDataTable = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/get-dataTable/${id}`
    );
    let data = await response.json();
    console.log(data.data[0]);
    setDataTables(data.data);
    return data;
  };

  useEffect(() => {
    getDataTable();
  }, []);

  return (
    <>
      <div className="d-flex justify-content-between mb-1">
        <h4 className="mt-3">Total no of entry = {dataTables.length}</h4>
        <Link className="btn btn-secondary" to="/">
          Back to dashboard
        </Link>
      </div>
      {dataTables.length !== 0 ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell align="left">Field Name</TableCell>
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
                  <TableCell align="left">{datatable.created_at}</TableCell>
                  <TableCell align="right">
                    <Stack
                      direction="row"
                      spacing={2}
                      display="flex"
                      justifyContent="end"
                    >
                      <Link
                        className="btn btn-dark"
                        to={`/datas/${datatable._id}`}
                      >
                        VIEW
                      </Link>

                      {/* <Button variant="contained" color="warning">
                        EDIT
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        //   onClick={() => deletePost(datatable._id)}
                      >
                        DELETE
                      </Button> */}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        "DATA NOT FOUND"
      )}
    </>
  );
}

export default DataTable;
