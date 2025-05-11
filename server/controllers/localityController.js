const db = require('../utils/db');

exports.getLocality = async (req, res) => {
  const locality = await db('locality').select('*');
  console.log("lkjhgf")
  res.json(locality);
};

exports.addLocality  = async (req, res) => {
  const { name, price } = req.body;
  try {
    await db('locality').insert({ name, price });
    res.status(200).json({success: true, message:'locality added successfully'});
  } catch (error) {
    res.status(500).send('Error adding locality');
  }
};

exports.deleteLocality  = async (req, res) => {
  const { id } = req.params;
  try {
    await db('locality').where({ id }).del();
    res.status(200).json({success: true, message:'locality deleted successfully'});
  } catch (error) {
    res.status(500).send('Error deleting locality');
  }
};

exports.updateLocality = async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  try {
    await db('locality').where({ id }).update({ name, price });
    res.status(200).json({success: true, message:'locality updated successfully'});
  } catch (error) {
    res.status(500).send('Error updating locality');
  }
};
