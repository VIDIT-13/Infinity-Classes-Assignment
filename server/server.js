const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const Question = require('./models/Question');
const User = require('./models/User');
const { sampleQuestions } = require('./seeds/seedQuestions');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(express.json());

// Request logger for dev
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/test', require('./routes/testRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Mini Online Test App API',
  });
});

// Auto-seed helper if DB is connected and empty
const checkAndAutoSeed = async () => {
  try {
    const questionCount = await Question.countDocuments();
    if (questionCount === 0) {
      console.log('🌱 No questions found. Auto-seeding initial question bank...');
      await Question.insertMany(sampleQuestions);
      console.log(`✅ Seeded ${sampleQuestions.length} default test questions.`);
    }

    const studentCount = await User.countDocuments({ email: 'student@infinity.com' });
    if (studentCount === 0) {
      await User.create({
        name: 'Demo Student',
        email: 'student@infinity.com',
        password: 'student123',
        role: 'student',
      });
      console.log('✅ Created demo student account (student@infinity.com / student123)');
    }

    const adminCount = await User.countDocuments({ email: 'admin@infinity.com' });
    if (adminCount === 0) {
      await User.create({
        name: 'Admin Instructor',
        email: 'admin@infinity.com',
        password: 'admin123',
        role: 'admin',
      });
      console.log('✅ Created demo admin account (admin@infinity.com / admin123)');
    }
  } catch (error) {
    console.warn('⚠️ Auto-seed check failed or skipped:', error.message);
  }
};

// Global 404 handler for unmatched API routes
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found',
  });
});

// Serve static assets in production if client build exists
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../client/dist');
  app.use(express.static(clientBuildPath));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(clientBuildPath, 'index.html'));
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error occurred',
  });
});

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  const isConnected = await connectDB();
  if (isConnected) {
    await checkAndAutoSeed();
  } else {
    console.log('ℹ️  Server starting without MongoDB connection. Provide MONGODB_URI to enable full database operations.');
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();

module.exports = app;
