const express = require('express');
const mongoose = require('mongoose');
const expressEjsLayouts = require('express-ejs-layouts');
const path = require('path');
const session = require('express-session');
const ensureAuthenticated = require('./middlewares/ensureAuthenticated'); 

const server = express();


server.set('view engine', 'ejs');
server.use(expressEjsLayouts);
server.use(express.json());
server.use(express.urlencoded({ extended: true }));


server.use(express.static(path.join(__dirname, 'public')));
server.set('views', path.join(__dirname, 'views'));




server.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

const groceriesRouter = require('./routes/user/user.products.controller');
server.use('/', groceriesRouter);

const ensureAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.redirect('/login');
};





server.get('/', ensureAuthenticated, (req, res) => {
  res.render('morrisons');
});


server.get('/admin',ensureAuthenticated, (req, res) => {
  res.render("admin/adminPanel", {
      layout: "adminlayout", 
      pageTitle: "Admin Panel"
  });
});

server.get('/admin/adminPanel',ensureAuthenticated, (req, res) =>{
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
