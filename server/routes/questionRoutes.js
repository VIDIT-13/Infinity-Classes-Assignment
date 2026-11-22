const express = require('express');
const router = express.Router();
const {
  getTestQuestions,
  getAllQuestions,
  createQuestion,
  deleteQuestion,
} = require('../controllers/questionController');
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');

// Student test route: retrieve 10 randomized sanitized questions
router.get('/test', protect, getTestQuestions);

// Admin routes
router.get('/', protect, requireAdmin, getAllQuestions);
router.post('/', protect, requireAdmin, createQuestion);
router.delete('/:id', protect, requireAdmin, deleteQuestion);

module.exports = router;
