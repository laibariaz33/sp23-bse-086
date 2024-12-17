const mongoose = require('mongoose');
  const orderSchema = new mongoose.Schema({
    name: String,
    address: String,
    phone: String,
    email: String,
    paymentMethod: String,
    cart: Array,  // Array of cart items
    orderDate: { type: Date, default: Date.now }
  });
  
  const Order = mongoose.model('Order', orderSchema);
  module.exports = Order; 