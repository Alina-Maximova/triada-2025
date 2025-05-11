const express = require('express');
const router = express.Router();
const localityController = require('../controllers/localityController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', localityController.getLocality);
router.post('/', authMiddleware, localityController.addLocality);
router.delete('/:id',authMiddleware, localityController.deleteLocality);
router.put('/:id', authMiddleware, localityController.updateLocality);

module.exports = router;
