const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },  // Auto-generated Order ID
  name: String,
  address: String,
  phone: String,
  email: String,
  paymentMethod: String,
  cart: Array,  
  totalAmount: Number,  
  orderDate: { type: Date, default: Date.now } 
});


orderSchema.index({ orderDate: -1 });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
