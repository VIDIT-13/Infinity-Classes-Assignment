import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { api } from '../api/api';
import { playSelectSound, playTickSound, playSuccessChime } from '../utils/soundEffects';

const TestContext = createContext(null);

const TEST_DURATION_SECONDS = 600; // 10 minutes

export const TestProvider = ({ children }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: selectedOptionIndex }
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [timeRemaining, setTimeRemaining] = useState(TEST_DURATION_SECONDS);
  const [isTestActive, setIsTestActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [error, setError] = useState(null);

  const timerRef = useRef(null);

  // Clear timer helper
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Start new test
  const startNewTest = async () => {
    setLoadingQuestions(true);
    setError(null);
    try {
      const data = await api.getTestQuestions();
      if (!data.success || !data.questions || data.questions.length === 0) {
        throw new Error('No test questions available. Please ask admin to seed questions.');
      }

      setQuestions(data.questions);
      setCurrentIndex(0);
      setAnswers({});
      setMarkedForReview(new Set());
      setTimeRemaining(TEST_DURATION_SECONDS);
      setIsTestActive(true);
      setIsSubmitting(false);
      setLastResult(null);

      // Start Countdown
      stopTimer();
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            stopTimer();
            // Trigger auto-submit when timer hits 0
            handleAutoSubmit();
            return 0;
          }
          if (prev <= 10 && prev > 1) {
            playTickSound();
          }
          return prev - 1;
        });
      }, 1000);

      return true;
    } catch (err) {
      console.error('Error starting test:', err);
      setError(err.message || 'Failed to start test');
      return false;
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Submit test (called manually by student or automatically on timeout)
  const submitTest = async () => {
    if (isSubmitting) return null;
    setIsSubmitting(true);
    stopTimer();

    try {
      const formattedAnswers = questions.map((q) => ({
        questionId: q._id,
        selectedOptionIndex: answers[q._id] !== undefined ? answers[q._id] : -1,
      }));

      const timeSpentSeconds = TEST_DURATION_SECONDS - timeRemaining;

      const result = await api.submitTest(formattedAnswers, timeSpentSeconds);
      if (result.success) {
        setLastResult(result);
        setIsTestActive(false);
        playSuccessChime();
        return result;
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message || 'Failed to submit test');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Internal auto-submit handler to avoid stale closures
  const handleAutoSubmit = async () => {
    console.log('⏳ Time ran out! Auto-submitting test...');
    await submitTest();
  };

  // Select an option
  const selectOption = (questionId, optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
    playSelectSound();
  };

  // Clear answer for current question
  const clearOption = (questionId) => {
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[questionId];
      return copy;
    });
  };

  // Toggle mark for review
  const toggleMarkForReview = (questionId) => {
    setMarkedForReview((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  // Navigation
  const goToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentIndex(index);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => stopTimer();
  }, []);

  return (
    <TestContext.Provider
      value={{
        questions,
        currentQuestion: questions[currentIndex] || null,
        currentIndex,
        totalQuestions: questions.length,
        answers,
        markedForReview,
        timeRemaining,
        isTestActive,
        isSubmitting,
        lastResult,
        loadingQuestions,
        error,
        startNewTest,
        selectOption,
        clearOption,
        toggleMarkForReview,
        goToQuestion,
        nextQuestion,
        prevQuestion,
        submitTest,
      }}
    >
      {children}
    </TestContext.Provider>
  );
};

export const useTest = () => {
  const context = useContext(TestContext);
  if (!context) {
    throw new Error('useTest must be used within a TestProvider');
  }
  return context;
};
