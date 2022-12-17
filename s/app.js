const mongoose = require("mongoose");

const express = require("express");
const app = express();
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");

const fileRoutes = require("./routes/file.routes.js");
const dataTableRoutes = require("./routes/dataTable.routes.js");
const dataRoutes = require("./routes/data.routes.js");


app.use(express.json({ limit: "500mb" }));

app.use(cors());

require("dotenv").config();

require("./db/conn");

//
app.use("/api/auth", authRoutes);

app.use("/api", fileRoutes);
app.use("/api", dataTableRoutes);
app.use("/api", dataRoutes);


app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(404);
});

const PORT = process.env.IP || 3001;
app.listen(PORT, () => {
  console.log("Server is running in port:", PORT);
});
