const express = require("express");
const fs = require('fs');
const multer = require("multer");
const path = require("path");
const router = express.Router();
const Product = require("../../models/products");
const Category=require("../../models/categories");

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images"); // Save images in the 'images' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use current timestamp for unique filenames
  },
});

const upload = multer({ storage: storage });

// GET: Show all products
router.get("/admin/products", async (req, res) => {
  try {
    // Fetch all products and populate the category field to show category names
    const products = await Product.find().populate('category'); // Populate the category field

    res.render("admin/products/index", { 
      pageTitle: "Products", 
      layout: "adminlayout", 
      products 
    });
  } catch (error) {
    res.status(500).send("Error fetching products");
  }
});

// GET: Show form to create a new product
router.get('/admin/products/create', async (req, res) => {
  const categories = await Category.find();
  res.render('admin/products/create', {
    layout: 'adminlayout',
    categories, 
  });
});


// POST: Create a new product with image upload
router.post('/admin/products/create', upload.single('productImage'), async (req, res) => {
  try {
    let data = req.body;

    // If a file is uploaded, assign the image path
    if (req.file) {
      data.image = `/images/${req.file.filename}`; // Ensure the correct path is assigned
    }

    const newProduct = new Product({
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.categoryId, // Set category to the categoryId from the form
      image: data.image, // Store the image URL
    });

    await newProduct.save();

    // Now find the associated category and add the product to the category's products array
    let category = await Category.findById(data.categoryId);
    if (category) {
      category.products.push(newProduct._id); // Add the new product's ID to the category
      await category.save(); // Save the updated category
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

    // Find the product to update
    let product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send("Product not found.");
    }

    let oldCategoryId = product.category; // Get the old category ID
    let newCategoryId = data.categoryId;  // Get the new category ID (from the form)

    // If a new image is uploaded, set the image field
    if (req.file) {
      // If there was an old image, delete it from the server
      if (product.image) {
        let oldImagePath = path.join(__dirname, '..', 'public', product.image); // Get the full path of the old image
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); // Delete the old image file
        }
      }

      // Set the new image path
      data.image = `/images/${req.file.filename}`;
    } else {
      // If no new image is uploaded, retain the old image
      data.image = product.image;
    }

    // Update the product fields
    product.name = data.name;
    product.description = data.description;
    product.price = data.price;
    product.category = newCategoryId; // Update the category to the new one
    product.image = data.image; // Update the image field (if changed)
    await product.save();

    // Update old and new category references
    if (oldCategoryId && oldCategoryId.toString() !== newCategoryId) {
      // Remove the product from the old category's products array
      let oldCategory = await Category.findById(oldCategoryId);
      if (oldCategory) {
        oldCategory.products.pull(productId);  // Remove the product ID from old category
        await oldCategory.save(); // Save the updated old category
      }

      // Add the product to the new category's products array
      let newCategory = await Category.findById(newCategoryId);
      if (newCategory) {
        newCategory.products.push(productId);  // Add the product ID to new category
        await newCategory.save(); // Save the updated new category
      }
    }

    // Redirect after successful update
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
    res.redirect('/admin/products'); // Redirect after successful deletion
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting product.");
  }
});

router.use(express.static(path.join(__dirname, 'public')));
module.exports = router;
