const Question = require('../models/Question');
const TestAttempt = require('../models/TestAttempt');

// @desc    Submit test answers, evaluate score, save attempt
// @route   POST /api/test/submit
// @access  Private
const submitTest = async (req, res) => {
  try {
    const { answers = [], timeSpentSeconds = 0 } = req.body;

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No answers provided for evaluation',
      });
    }

    // Extract all question IDs from user submission
    const questionIds = answers.map((a) => a.questionId);

    // Fetch original questions from DB with correctOptionIndex and explanation
    const dbQuestions = await Question.find({ _id: { $in: questionIds } });
    const questionMap = new Map();
    dbQuestions.forEach((q) => questionMap.set(q._id.toString(), q));

    let score = 0;
    const evaluatedAnswers = [];

    for (const submittedAnswer of answers) {
      const q = questionMap.get(submittedAnswer.questionId);
      if (!q) continue;

      const selectedOptionIndex =
        submittedAnswer.selectedOptionIndex !== undefined
          ? Number(submittedAnswer.selectedOptionIndex)
          : -1;

      const isCorrect = selectedOptionIndex === q.correctOptionIndex;
      if (isCorrect) {
        score += 1;
      }

      evaluatedAnswers.push({
        questionId: q._id,
        questionText: q.questionText,
        codeSnippet: q.codeSnippet,
        options: q.options,
        selectedOptionIndex,
        correctOptionIndex: q.correctOptionIndex,
        isCorrect,
        explanation: q.explanation || 'No detailed explanation provided for this question.',
      });
    }

    const totalQuestions = evaluatedAnswers.length;
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

    const attempt = await TestAttempt.create({
      userId: req.user._id,
      score,
      totalQuestions,
      percentage,
      timeSpentSeconds: Math.max(0, Number(timeSpentSeconds) || 0),
      answers: evaluatedAnswers,
      submittedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: 'Test submitted and evaluated successfully!',
      attemptId: attempt._id,
      score,
      totalQuestions,
      percentage,
      timeSpentSeconds: attempt.timeSpentSeconds,
      submittedAt: attempt.submittedAt,
      answers: evaluatedAnswers,
    });
  } catch (error) {
    console.error('Error submitting test:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to evaluate and save test results',
    });
  }
};

// @desc    Get current student's test history
// @route   GET /api/test/history
// @access  Private
const getStudentHistory = async (req, res) => {
  try {
    const attempts = await TestAttempt.find({ userId: req.user._id })
      .select('score totalQuestions percentage timeSpentSeconds submittedAt createdAt')
      .sort({ submittedAt: -1 });

    // Compute student aggregate stats
    const totalAttempts = attempts.length;
    const highestScore =
      totalAttempts > 0 ? Math.max(...attempts.map((a) => a.score)) : 0;
    const highestPercentage =
      totalAttempts > 0 ? Math.max(...attempts.map((a) => a.percentage)) : 0;
    const averageScore =
      totalAttempts > 0
        ? (attempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts).toFixed(1)
        : 0;

    return res.status(200).json({
      success: true,
      totalAttempts,
      highestScore,
      highestPercentage,
      averageScore: Number(averageScore),
      history: attempts,
    });
  } catch (error) {
    console.error('Error retrieving history:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve test history',
    });
  }
};

// @desc    Get detailed review of a specific past test attempt
// @route   GET /api/test/attempt/:id
// @access  Private
const getAttemptById = async (req, res) => {
  try {
    const attempt = await TestAttempt.findById(req.params.id);

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Test attempt record not found',
      });
    }

    // Ensure only the owner or an admin can access this attempt
    if (
      attempt.userId.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this test attempt',
      });
    }

    return res.status(200).json({
      success: true,
      attempt,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve test attempt details',
    });
  }
};

module.exports = {
  submitTest,
  getStudentHistory,
  getAttemptById,
};
