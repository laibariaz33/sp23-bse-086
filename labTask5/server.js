const express = require("express");
var expressLayouts = require("express-ejs-layouts");
let server = express();
server.set("view engine", "ejs");
server.use(expressLayouts);
server.use(express.static("public"));

let adminProductsRouter = require("./routes/admin/products.controller");
server.use(adminProductsRouter);

server.get("/", (req, res) => {
  return res.render("morrisons");
});
server.get("/portFolio", (req, res) => {
  return res.send(res.render("portFolio"));
});




server.listen(5000, () => {
  console.log(`Server Started at localhost:5000`);
});