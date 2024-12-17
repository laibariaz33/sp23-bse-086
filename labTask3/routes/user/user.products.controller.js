const express = require('express');
const router = express.Router();
let Product = require("../../models/products")
let Category = require("../../models/categories");


router.get('/GrocriesHome/:page?', async (req, res) => {
  try {
    let page = req.params.page ? Number(req.params.page) : 1; // Current page
    let pageSize = 5; // Max 5 products per category
    let categoriesPerPage = 2; // Number of categories to show on one page

    // Fetch categories with pagination (2 categories per page)
    const categories = await Category.find({})
      .skip((page - 1) * categoriesPerPage)
      .limit(categoriesPerPage);

    if (!categories.length) {
      console.error("No categories found");
      return res.status(404).send("No categories found");
    }

    // Fetch up to 5 products for each category
    const productsByCategory = {};
    for (const category of categories) {
      const products = await Product.find({ category: category._id })
        .limit(pageSize);
      productsByCategory[category.name] = products;
    }

    // Calculate total pages based on the total number of categories
    const totalCategories = await Category.countDocuments({});
    const totalPages = Math.ceil(totalCategories / categoriesPerPage);

    // Render the page with products grouped by category
    res.render('GrocriesHome', {
      productsByCategory, // Pass products grouped by categories
      page,
      totalPages,
    });
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).send('Error fetching products');
  }
});




module.exports = router;