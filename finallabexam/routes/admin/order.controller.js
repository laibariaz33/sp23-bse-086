const express = require("express");
const fs = require('fs');
const multer = require("multer");
const path = require("path");
const router = express.Router();
// const Product = require("../../models/products");
const Order=require("../../models/order");

router.get('/admin/orders', (req, res) => {
    Order.find().sort({ orderDate: -1 })  // Sort by order date in descending order
      .then(orders => {
        res.render('admin/orders/index', { orders , layout:"adminlayout" });
      })
      .catch(err => {
        console.error('Error fetching orders:', err);
        res.status(500).send('Error fetching orders');
      });
  });
  router.delete('/delete-order/:id', async (req, res) => {
    try {
      const orderId = req.params.id;
  
      // Find and delete the order
      const deletedOrder = await Order.findByIdAndDelete(orderId);
  
      if (!deletedOrder) {
        return res.status(404).send('Order not found');
      }
  
      res.status(200).send('Order deleted successfully');
    } catch (error) {
      console.error('Error deleting order:', error.message);
      res.status(500).send('Error deleting order');
    }
  });
  
  
  module.exports = router;