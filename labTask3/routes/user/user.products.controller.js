const express = require('express');
const router = express.Router();
let Product = require("../../models/products")
let Category = require("../../models/categories");


router.get('/GrocriesHome/:page?', async (req, res) => {
  try {
   

    const category = await Category.findOne({ name: 'Grocries' });
    if (!category) {
      console.error("Category 'Grocries' not found");
      return res.status(404).send("Category 'Grocries' not found");
    }

    // Pagination logic
    let page = req.params.page ? Number(req.params.page) : 1; // Default to page 1 if not provided
    let pageSize = 12;

    // Count total products for the "Clothes" category
    let totalRecords = await Product.countDocuments({ category: category._id });
    

  
    let totalPages = Math.ceil(totalRecords / pageSize); // Calculate total pages

    const GrocriesHome = await Product.find({ category: category._id })
    .limit(pageSize)
    .skip((page - 1) * pageSize);

    if (!GrocriesHome.length) {
      console.warn('No products found for the "Grocries" category');
    }
    res.render('GrocriesHome', { 
      GrocriesHome: GrocriesHome,
      page,             
      pageSize,          
      totalPages,        
      totalRecords,   
    });
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).send('Error fetching products');
  }
});
// router.get('/toys', async (req, res) => {
//   try {
   

//     const category = await Category.findOne({ name: 'Toys' });
//     if (!category) {
//       console.error("Category 'Toys' not found");
//       return res.status(404).send("Category 'Toys' not found");
//     }

//     const toys = await Product.find({ category: category._id })
//     if (!toys.length) {
//       console.warn('No products found for the "Toys" category');
//     }
//     res.render('toys', { toys: toys });
//   } catch (error) {
//     console.error('Error fetching products:', error.message);
//     res.status(500).send('Error fetching products');
//   }
// });

module.exports = router;