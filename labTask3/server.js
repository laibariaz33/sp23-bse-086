const express = require('express');
const mongoose = require('mongoose');
const expressEjsLayouts = require('express-ejs-layouts');
const path = require('path');
const server = express();
const Product = require('./models/products'); // Ensure this path is correct
const Category = require('./models/categories'); // Ensure this path is correct

// Set EJS as the view engine
server.set('view engine', 'ejs');

// Use express layouts (if needed, can be removed if not used in your layout)
server.use(expressEjsLayouts);

// Serve static files (like images, CSS, JS)
server.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse URL-encoded bodies (for forms)
server.use(express.urlencoded({ extended: true }));

// Home page route
server.get('/', async (req, res) => {
  try {
    // Fetch a limited number of categories from the database
    const categories = await Category.find();

    // Fetch a limited number of products for each category
    const categoryProducts = await Promise.all(
      categories.map(async (category) => {
        const products = await Product.find({ category: category._id }).limit(4); // Adjust limit as needed
        return {
          category: category.name,
          products: products,
        };
      })
    );

    // Render the homepage with category and product data
    res.render('morrisons', { categoryProducts }); // Renders morrisons.ejs as the homepage
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});
server.get('/admin', (req, res) => {
  res.render("admin/dashboard", {
      layout: "adminlayout", 
      pageTitle: "Admin Dashboard"
  });
});

server.get('/admin/dashboard', (req, res) =>{
res.render("admin/dashboard", {
  layout: "adminlayout" ,
  pageTitle: "Admin Dashboard"
})
})
let adminProductsRouter = require("./routes/admin/products.controller");
server.use(adminProductsRouter);

//adminProductsRouter to handle all the category-related routes
let adminCategoriesProducts = require("./routes/admin/categories.controller");
server.use(adminCategoriesProducts);

// MongoDB connection
const connectionString = 'mongodb://localhost:27017/morrisons';
mongoose
  .connect(connectionString)
  .then(() => console.log('Connected to Mongo DB Server: ' + connectionString))
  .catch((error) => console.log(error.message));

// Start the server
const port = 5000;
server.listen(port, () => {
  console.log('Server started at localhost:5000');
});
