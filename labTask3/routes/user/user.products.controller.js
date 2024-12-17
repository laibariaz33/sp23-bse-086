const express = require('express');
const router = express.Router();
let Product = require("../../models/products")
let Category = require("../../models/categories");


router.get('/GrocriesHome/:page?', async (req, res) => {
  try {
    let page = req.params.page ? Number(req.params.page) : 1; 
    let pageSize = 5;  
    let categoriesPerPage = 2; 

    
    const categories = await Category.find({})
      .skip((page - 1) * categoriesPerPage)
      .limit(categoriesPerPage);

    if (!categories.length) {
      console.error("No categories found");
      return res.status(404).send("No categories found");
    }

    
    const productsByCategory = {};
    for (const category of categories) {
      const products = await Product.find({ category: category._id })
        .limit(pageSize);
      productsByCategory[category.name] = products;
    }

    
    const totalCategories = await Category.countDocuments({});
    const totalPages = Math.ceil(totalCategories / categoriesPerPage);

    
    res.render('GrocriesHome', {
      productsByCategory, 
      page,
      totalPages,
    });
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).send('Error fetching products');
  }
});




module.exports = router;