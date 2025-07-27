const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const auth = require('../middleware/authMiddleware');

router.post('/generate', auth, aiController.generateComponent);
router.post('/export', auth, aiController.exportCode);

module.exports = router; 