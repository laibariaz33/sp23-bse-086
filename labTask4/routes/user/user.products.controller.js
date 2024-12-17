const express = require('express');
const router = express.Router();
let Product = require("../../models/products");
let Category = require("../../models/categories");

router.get('/GrocriesHome/:page?', async (req, res) => {
  try {
    let page = req.params.page ? Number(req.params.page) : 1; 
    let pageSize = 5; 
    let categoriesPerPage = 2; 

    const sortOption = req.query.sort || ''; 
    const filterCategory = req.query.category || ''; 

    let categories;

   
    if (filterCategory) {
      categories = await Category.find({ name: { $regex: `^${filterCategory}$`, $options: 'i' } });
    } else {
      categories = await Category.find({})
        .skip((page - 1) * categoriesPerPage)
        .limit(categoriesPerPage);
    }

    if (!categories.length) {
      console.error("No categories found");
      return res.status(404).send("No categories found");
    }

    const productsByCategory = {};

    
    for (const category of categories) {
      let query = { category: category._id }; 

      let products = Product.find(query).limit(pageSize);

      
      if (sortOption === 'low-to-high') {
        products = products.sort({ price: 1 }); 
      } else if (sortOption === 'high-to-low') {
        products = products.sort({ price: -1 }); 
      }

      productsByCategory[category.name] = await products;
    }

    
    const totalCategories = await Category.countDocuments({});
    const totalPages = filterCategory ? 1 : Math.ceil(totalCategories / categoriesPerPage);

   
    res.render('GrocriesHome', {
      productsByCategory,
      page,
      totalPages,
      sortOption,
      filterCategory
    });
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).send('Error fetching products');
  }
});

module.exports = router;
