const Question = require('../models/Question');

// @desc    Get 10 randomized test questions (Sanitized: NO correct answers or explanations!)
// @route   GET /api/questions/test
// @access  Private
const getTestQuestions = async (req, res) => {
  try {
    const totalCount = await Question.countDocuments();
    if (totalCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'No questions found in database. Please seed or add questions first.',
      });
    }

    // Pick 10 random questions or sample all if <= 10
    const sampleSize = Math.min(10, totalCount);
    const questions = await Question.aggregate([
      { $sample: { size: sampleSize } },
      {
        $project: {
          _id: 1,
          questionText: 1,
          codeSnippet: 1,
          options: 1,
          category: 1,
          difficulty: 1,
          // CRITICAL: DO NOT project correctOptionIndex or explanation to prevent client tampering
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      count: questions.length,
      questions,
    });
  } catch (error) {
    console.error('Error fetching test questions:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve test questions',
    });
  }
};

// @desc    Get all questions for Admin view
// @route   GET /api/questions
// @access  Private / Admin
const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: questions.length,
      questions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve questions',
    });
  }
};

// @desc    Add a new question
// @route   POST /api/questions
// @access  Private / Admin
const createQuestion = async (req, res) => {
  try {
    const {
      questionText,
      codeSnippet,
      options,
      correctOptionIndex,
      explanation,
      category,
      difficulty,
    } = req.body;

    if (!questionText || !options || correctOptionIndex === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Question text, 4 options, and correct option index are required',
      });
    }

    if (!Array.isArray(options) || options.length !== 4) {
      return res.status(400).json({
        success: false,
        message: 'Exactly 4 non-empty options must be provided',
      });
    }

    const validIndex = Number(correctOptionIndex);
    if (isNaN(validIndex) || validIndex < 0 || validIndex > 3) {
      return res.status(400).json({
        success: false,
        message: 'Correct option index must be an integer between 0 and 3',
      });
    }

    const newQuestion = await Question.create({
      questionText: questionText.trim(),
      codeSnippet: codeSnippet || '',
      options: options.map((opt) => String(opt).trim()),
      correctOptionIndex: validIndex,
      explanation: explanation ? explanation.trim() : '',
      category: category ? category.trim() : 'Full-Stack Web Development',
      difficulty: difficulty || 'medium',
    });

    return res.status(201).json({
      success: true,
      message: 'Question added successfully',
      question: newQuestion,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create question',
    });
  }
};

// @desc    Delete a question
// @route   DELETE /api/questions/:id
// @access  Private / Admin
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    await Question.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Question deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete question',
    });
  }
};

module.exports = {
  getTestQuestions,
  getAllQuestions,
  createQuestion,
  deleteQuestion,
};
