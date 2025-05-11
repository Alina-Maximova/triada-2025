const db = require('../utils/db');

exports.getServices = async (req, res) => {
  const services = await db('services').select('*');
  res.json(services);
};

exports.addService = async (req, res) => {
  const { name, description, price } = req.body;
  try {
    await db('services').insert({ name, description, price });
    res.status(200).json({success: true, message:'Service added successfully'});
  } catch (error) {
    res.status(500).send('Error adding service');
  }
};

exports.deleteService = async (req, res) => {
  const { id } = req.params;
  try {
    await db('services').where({ id }).del();
    res.status(200).json({success: true, message:'Service deleted successfully'});
  } catch (error) {
    res.status(500).send('Error deleting service');
  }
};

exports.updateService = async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;
  try {
    await db('services').where({ id }).update({ name, description, price });
    res.status(200).json({success: true, message:'Service updated successfully'});
  } catch (error) {
    res.status(500).send('Error updating service');
  }
};
