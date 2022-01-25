const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const routes = require("./routes");
const path = require("path");

const app = express();
const apiport = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);


app.use("/api", routes);

app.get("/*", (req, res) => {
  res.redirect("/api");
});

app.listen(apiport, (err) => {
  console.log(`api at port ${apiport}`);
});