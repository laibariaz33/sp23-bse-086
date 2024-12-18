const express = require('express');
const mongoose = require('mongoose');
const expressEjsLayouts = require('express-ejs-layouts');
const path = require('path');
const session = require('express-session');
const server = express();
const middleware = require("./middlewares/ensureAutheticated");
// const adminMiddleware = require("./middlewares/adminMiddleware");

server.set('view engine', 'ejs');
server.use(expressEjsLayouts);

server.use(express.urlencoded({ extended: true }));

server.use(express.json());


server.use(session({
  secret: 'your-secret-key', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));


server.use((req, res, next) => {
  if (!req.session.cartCount) {
      req.session.cartCount = 0;
  }
  next();
});

// Set `session` as a local variable for EJS
server.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});


server.use(express.static(path.join(__dirname, 'public')));
server.set('views', path.join(__dirname, 'views'));




const groceriesRouter = require('./routes/user/user.products.controller');
server.use('/', groceriesRouter);




server.get('/admin',(req, res) => {
  res.render("admin/adminPanel", {
      layout: "adminlayout", 
      pageTitle: "Admin Panel"
  });
});

// server.get('/admin/adminPanel', (req, res) =>{
// res.render("admin/adminPanel", {
//   layout: "adminlayout" ,
//   pageTitle: "Admin Panel"
// })
// })

let adminProductsRouter = require("./routes/admin/products.controller");
server.use(adminProductsRouter);

let adminCategoriesProducts = require("./routes/admin/categories.controller");
server.use(adminCategoriesProducts);
let orderRoutes = require('./routes/admin/order.controller');
server.use(orderRoutes);

const connectionString = 'mongodb://localhost:27017/morrisons';
mongoose
  .connect(connectionString)
  .then(() => console.log('Connected to Mongo DB Server: ' + connectionString))
  .catch((error) => console.log(error.message));

  server.get("/", middleware ,(req, res) => {
    console.log(req.session.userId);
    return res.render("morrisons");
  });


const port = 5000;
server.listen(port, () => {
  console.log('Server started at localhost:5000');
});
