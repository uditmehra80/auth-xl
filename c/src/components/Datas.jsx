import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Progress from "./Progress";
import format from "date-fns/format";

function Datas(props) {
  let { id } = useParams();
  const navigate = useNavigate();

  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(false);

  const getDataTable = async () => {
    setLoading(true);
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/get-datas/${id}`
    );
    let data = await response.json();
    setDatas(data.data);
    setLoading(false);

    return data;
  };

  useEffect(() => {
    getDataTable();
  }, []);

  return (
    <>
      <div className="d-flex justify-content-between mb-1">
        <h4 className="mt-3">Total no of entry = {datas.length}</h4>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Go back
        </button>
      </div>
      {datas.length !== 0 ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell align="left">Date</TableCell>
                <TableCell align="left">Value</TableCell>
                {/* <TableCell align="right">Action</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {datas?.map((data, index) => (
                <TableRow
                  key={data._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell align="left">
                    {format(new Date(data.date), "dd-MM-yyyy")}
                  </TableCell>
                  <TableCell align="left">{data.value}</TableCell>
                  {/* <TableCell align="right">
                    <Stack
                      direction="row"
                      spacing={2}
                      display="flex"
                      justifyContent="end"
                    >
                      <Button variant="contained" color="warning">
                        EDIT
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        //   onClick={() => deletePost(datatable._id)}
                      >
                        DELETE
                      </Button>
                    </Stack>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <>{loading ? <Progress /> : "DATAS NOT FOUND"}</>
      )}
    </>
  );
}

export default Datas;
