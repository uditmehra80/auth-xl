import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

function GetFiles(loadData) {
  const [files, setFiles] = useState([]);
  const getdata = async () => {
    const response = await fetch("http://localhost:3001/api/get-file");
    let data = await response.json();
    console.log(data.data[0]);
    setFiles(data.data);
    return data;
  };

  useEffect(() => {
    getdata();
  }, [loadData]);

  async function deletePost(id) {
    console.log(id);
    await fetch(`http://localhost:3001/api/delete-file/${id}`, {
      method: "DELETE",
    });
    getdata();
  }

  return (
    <div>
      <h4
        style={{
          marginTop: "-30px",
        }}
      >
        Total no of files = {files.length}
      </h4>
      {files.length !== 0 && (
        <TableContainer className="mt-3" component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell align="left">FileName</TableCell>
                <TableCell align="left">Reference Id</TableCell>
                <TableCell align="left">Created at</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {files.map((file, index) => (
                <TableRow
                  key={file._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell align="left">{file.filename}</TableCell>
                  <TableCell align="left">{file.referenceId}</TableCell>
                  <TableCell align="left">{file.created_at}</TableCell>
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
                        onClick={() => deletePost(file._id)}
                      >
                        DELETE
                      </Button>
                      <Link
                        className="btn btn-dark"
                        to={`/dataTable/${file._id}`}
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
      )}
    </div>
  );
}

export default GetFiles;
