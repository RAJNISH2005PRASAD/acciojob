const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, sessionController.createSession);
router.get('/', auth, sessionController.listSessions);
router.get('/:id', auth, sessionController.getSession);
router.put('/:id', auth, sessionController.updateSession);
router.delete('/:id', auth, sessionController.deleteSession);

module.exports = router; 