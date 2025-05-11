// controllers/productController.js
const db = require('../utils/db');
const multer = require('multer');


exports.getProducts = async (req, res) => {
  const products = await db('products').select('*');
  res.json(products);
};

exports.addProduct = async (req, res) => {
  const { name, description, price, quantity, photoUrl } = req.body;
 

  try {

    await db('products').insert({ name, description, price, quantity, photo_path: photoUrl });
    res.status(200).json({success: true, message:'Продукт добавлен'});
  } catch (error) {
    res.status(500).send('Произошла ошибка добавления товара');
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await db('products').where({ id }).del();
    res.status(200).json({success: true, message:'Product deleted successfully'});
  } catch (error) {
    res.status(500).send('Error deleting product');
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, quantity } = req.body;
console.log(req.body)    
  try {
    await db('products').where({ id }).update({ name, description, price, quantity  });
    res.status(200).json({success: true, message:'Product updated successfully'});
  } catch (error) {
    res.status(500).send('Error updating product');
  }
};
