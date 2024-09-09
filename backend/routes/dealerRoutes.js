const express = require('express');
const { getDealers, addDealer, updateDealer, deleteDealer } = require('../controllers/dealerController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware); // Protect these routes
router.get('/', getDealers);
router.post('/', addDealer);
router.put('/:id', updateDealer);
router.delete('/:id', deleteDealer);

module.exports = router;
