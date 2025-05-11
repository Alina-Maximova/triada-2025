const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', serviceController.getServices);
router.post('/', authMiddleware, serviceController.addService);
router.delete('/:id',authMiddleware, serviceController.deleteService);
router.put('/:id', authMiddleware, serviceController.updateService);

module.exports = router;
