const express = require('express');
const router = express.Router();
const {
  submitTest,
  getStudentHistory,
  getAttemptById,
} = require('../controllers/testController');
const { protect } = require('../middleware/authMiddleware');

router.post('/submit', protect, submitTest);
router.get('/history', protect, getStudentHistory);
router.get('/attempt/:id', protect, getAttemptById);

module.exports = router;

