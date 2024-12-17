const express = require('express');
const mongoose = require('mongoose');
const expressEjsLayouts = require('express-ejs-layouts');
const path = require('path');
const server = express();


server.set('view engine', 'ejs');
server.use(expressEjsLayouts);


server.use(express.static(path.join(__dirname, 'public')));
server.set('views', path.join(__dirname, 'views'));


server.use(express.urlencoded({ extended: true }));

const groceriesRouter = require('./routes/user/user.products.controller');
server.use('/', groceriesRouter);

server.get("/", (req, res) => {
  return res.render("morrisons");
});


server.get('/admin', (req, res) => {
  res.render("admin/adminPanel", {
      layout: "adminlayout", 
      pageTitle: "Admin Panel"
  });
});

server.get('/admin/adminPanel', (req, res) =>{
res.render("admin/adminPanel", {
  layout: "adminlayout" ,
  pageTitle: "Admin Panel"
})
})

let adminProductsRouter = require("./routes/admin/products.controller");
server.use(adminProductsRouter);

let adminCategoriesProducts = require("./routes/admin/categories.controller");
server.use(adminCategoriesProducts);

const connectionString = 'mongodb://localhost:27017/morrisons';
mongoose
  .connect(connectionString)
  .then(() => console.log('Connected to Mongo DB Server: ' + connectionString))
  .catch((error) => console.log(error.message));

const port = 5000;
server.listen(port, () => {
  console.log('Server started at localhost:5000');
});
