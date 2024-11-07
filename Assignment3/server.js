const express = require("express");
let server = express();

server.set("view engine", "ejs");

server.use(express.static("public"));

server.get("/morrisons", (req, res) => {
  res.render("morrisons");
});
server.get("/", (req, res) => {
  res.send(res.render("portFolio"));
});

server.listen(5000, () => {
  console.log(`Server Started at localhost:5000`);
});