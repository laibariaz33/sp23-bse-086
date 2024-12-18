const express = require('express');
const router = express.Router();
let Product = require("../../models/products");
let Category = require("../../models/categories");
let Order = require("../../models/order");
const User = require('../../models/user');


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


router.post('/add-to-cart', (req, res) => {
  const { id, name, price, image } = req.body;

  if (!req.session.cart) {
    req.session.cart = [];
    req.session.cartCount = 0;
  }

  const existingProduct = req.session.cart.find(item => item.id === id);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    req.session.cart.push({
      id,
      name,
      price: parseFloat(price),
      image,
      quantity: 1
    });
  }

  req.session.cartCount = req.session.cart.reduce((total, item) => total + item.quantity, 0);

  res.json({ success: true, cartCount: req.session.cartCount });
});

router.get('/cart', (req, res) => {
  const cart = req.session.cart || [];
  res.render('cart', { cart, });
});

router.post('/remove-from-cart', (req, res) => {
  const { id } = req.body;

  const itemIndex = req.session.cart.findIndex(item => item.id === id);

  if (itemIndex !== -1) {
    req.session.cart.splice(itemIndex, 1);
  }

  req.session.cartCount = req.session.cart.reduce((total, item) => total + item.quantity, 0);

  res.json({ success: true, cartCount: req.session.cartCount, cart: req.session.cart });
});

router.get('/checkout', (req, res) => {
  const cart = req.session.cart || [];
  res.render('checkout', { layout: false, cart });
});




router.post('/place-order', (req, res) => {
  try {
      const { name, address, phone, email, paymentMethod } = req.body;
      const cart = JSON.parse(req.body.cart || '[]'); // Parse the cart data

      if (!Array.isArray(cart) || cart.length === 0) {
          return res.status(400).send('Cart is empty or invalid');
      }

      const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const orderId = 'ORD' + Date.now();

      const newOrder = new Order({
          orderId,
          name,
          address,
          phone,
          email,
          paymentMethod,
          cart,
          totalAmount,
      });

      newOrder.save()
          .then(() => {
              res.redirect('/orderConfirmation');
          })
          .catch(err => {
              console.error('Error placing order:', err);
              res.status(500).send('Error placing order');
          });
  } catch (error) {
      console.error('Error in place-order route:', error.message);
      res.status(500).send('Internal Server Error');
  }
});

router.get('/orderConfirmation', (req, res) => {
  res.render('orderConfirmation', { name: req.body.name || "Customer" });
});






router.get('/register', (req, res) => {
  res.render('register', { layout: false });
});




router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
console.log(req.body);
   
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).send('User already exists. Please log in.');
    }

    
    if (!username) {
      return res.status(400).send('Username is required');
    }
    if (!email) {
      return res.status(400).send('Email is required');
    }
    if (!password) {
      return res.status(400).send('Password is required');
    }

    
    const newUser = new User({ username, email, password });
    await newUser.save();

    
    res.redirect('/login');
  } catch (error) {
    console.error('Error during registration:', error.message);
    res.status(500).send('Internal Server Error');
  }
});


router.get('/login', (req, res) => {
  res.render('login', { layout: false });
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

   
    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    });

    if (!user || user.password !== password) {
      return res.status(401).send('Invalid credentials. Please try again.');
    }

   
    req.session.userId = user._id;

  
    res.redirect('/');
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).send('Internal Server Error');
  }
});



router.get('/logout', (req, res) => {
  
  req.session.destroy((err) => {
    if (err) {
      return res.redirect('/error'); 
    }
    res.redirect('/login'); 
  });
});


module.exports = router;

