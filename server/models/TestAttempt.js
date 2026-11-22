const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    questionText: {
      type: String,
      required: true,
    },
    codeSnippet: {
      type: String,
      default: '',
    },
    options: {
      type: [String],
      required: true,
    },
    selectedOptionIndex: {
      type: Number,
      default: -1, // -1 means unanswered
    },
    correctOptionIndex: {
      type: Number,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
    explanation: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const testAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    score: {
      type: Number,
      required: true,
      default: 0,
    },
    totalQuestions: {
      type: Number,
      required: true,
      default: 10,
    },
    percentage: {
      type: Number,
      required: true,
      default: 0,
    },
    timeSpentSeconds: {
      type: Number,
      default: 0,
    },
    answers: [answerSchema],
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('TestAttempt', testAttemptSchema);

