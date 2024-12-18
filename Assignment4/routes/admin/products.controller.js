const express = require("express");
const fs = require('fs');
const multer = require("multer");
const path = require("path");
const router = express.Router();
const Product = require("../../models/products");
const Category=require("../../models/categories");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const upload = multer({ storage: storage });


router.get("/admin/products", async (req, res) => {
  try {
    const { query } = req.query; 
    let filter = {}; 

    if (query) {
     
      const regexQuery = { $regex: query, $options: 'i' };

      
      filter = {
        $or: [
          { name: regexQuery }, 
          { 'category.name': regexQuery } 
        ]
      };
    }

    
    const products = await Product.find(filter).populate('category');

    
    const categories = await Category.find();

   
    res.render("admin/products/index", {
      pageTitle: "Products",
      layout: "adminlayout",
      products,
      categories,
      query, 
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching products");
  }
});





router.get('/admin/products/create', async (req, res) => {
  const categories = await Category.find();
  res.render('admin/products/create', {
    layout: 'adminlayout',
    categories, 
  });
});



router.post('/admin/products/create', upload.single('productImage'), async (req, res) => {
  try {
    let data = req.body;
    if (req.file) {
      data.image = `/images/${req.file.filename}`; 
    }
    const newProduct = new Product({
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.categoryId, 
      image: data.image,
    });
    await newProduct.save();
     let category = await Category.findById(data.categoryId);
    if (category) {
      category.products.push(newProduct._id); 
      await category.save(); 
    }
     res.redirect('/admin/products');
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error saving product.");
  }
});


router.get('/admin/products/edit/:id', async(req, res) => {
  try {
    let product = await Product.findById(req.params.id).populate('category');
    const categories = await Category.find();

    res.render("admin/products/edit", {
      layout: "adminlayout",
      product,
      categories,
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading product edit page.');
  }
});


router.post('/admin/products/edit/:id', upload.single('productImage'), async (req, res) => {
  try {
    let productId = req.params.id;
    let data = req.body;
    let product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send("Product not found.");
    }
    let oldCategoryId = product.category; 
    let newCategoryId = data.categoryId; 
    if (req.file) {
      
      if (product.image) {
        let oldImagePath = path.join(__dirname, '..', 'public', product.image); 
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); 
        }
      }
      data.image = `/images/${req.file.filename}`;
    } else {
      
      data.image = product.image;
    }
    product.name = data.name;
    product.description = data.description;
    product.price = data.price;
    product.category = newCategoryId; 
    product.image = data.image; 
    await product.save();
     if (oldCategoryId && oldCategoryId.toString() !== newCategoryId) {
      
      let oldCategory = await Category.findById(oldCategoryId);
      if (oldCategory) {
        oldCategory.products.pull(productId);  
        await oldCategory.save(); 
      }
       let newCategory = await Category.findById(newCategoryId);
      if (newCategory) {
        newCategory.products.push(productId); 
        await newCategory.save(); 
      }
    }
    res.redirect('/admin/products');
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating product.");
  }
});




router.post("/admin/products/delete/:id", async (req, res) => {
  try {
    let product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).send("Product not found.");
    }
    res.redirect('/admin/products'); 
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting product.");
  }
});

router.use(express.static(path.join(__dirname, 'public')));
module.exports = router;
