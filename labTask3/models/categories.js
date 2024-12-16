const mongoose = require('mongoose');

// Define the schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // Products associated with the category
});

// Check if the model already exists to avoid redefining it
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

module.exports = Category;
