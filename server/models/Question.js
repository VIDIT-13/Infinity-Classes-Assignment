const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    codeSnippet: {
      type: String,
      default: '',
    },
    options: {
      type: [String],
      required: [true, 'Four options are required'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length === 4;
        },
        message: 'Question must have exactly 4 options',
      },
    },
    correctOptionIndex: {
      type: Number,
      required: [true, 'Correct option index is required (0-3)'],
      min: [0, 'Index must be between 0 and 3'],
      max: [3, 'Index must be between 0 and 3'],
    },
    explanation: {
      type: String,
      default: '',
      trim: true,
    },
    category: {
      type: String,
      default: 'Class 10 CBSE Science',
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Question', questionSchema);

