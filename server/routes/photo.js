// routes/photoRoutes.js
const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photoController');

router.post('/upload', photoController.uploadPhoto);
router.get('/:filename', photoController.getPhoto);

module.exports = router;