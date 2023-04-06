"use strict";

var express = require("express");

var dotenv = require("dotenv");

var cors = require("cors");

var axios = require("axios");

var bodyParser = require("body-parser");

var routes = require("./routes");

dotenv.config();
var app = express();
var port = process.env.PORT || 80;
app.use(cors());
app.use(bodyParser.json({
  limit: "50mb",
  extended: true
}));
app.use(bodyParser.urlencoded({
  limit: "50mb",
  extended: true
}));
app.use("/api/v1", routes);
var server = app.listen(port, function () {
  console.log("Server is running on port: ".concat(port));
});
