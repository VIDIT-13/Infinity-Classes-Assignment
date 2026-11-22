const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Question = require('../models/Question');
const User = require('../models/User');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

const sampleQuestions = [
  {
    questionText: 'Which lifecycle method or hook in React is used to perform side effects such as data fetching or subscriptions?',
    codeSnippet: 'useEffect(() => {\n  fetchData();\n}, []);',
    options: ['useState', 'useEffect', 'useMemo', 'useReducer'],
    correctOptionIndex: 1,
    explanation: 'useEffect is specifically designed in React functional components to manage side-effects, API calls, event listeners, and cleanup timers.',
    category: 'React & Frontend',
    difficulty: 'easy',
  },
  {
    questionText: 'What is the purpose of the MongoDB `_id` field in every document?',
    codeSnippet: '{\n  "_id": ObjectId("64bf..."),\n  "name": "Student"\n}',
    options: [
      'It acts as an optional timestamp for records',
      'It is an immutable primary key uniquely identifying documents',
      'It encrypts document fields automatically',
      'It is required only when establishing database relationships',
    ],
    correctOptionIndex: 1,
    explanation: 'In MongoDB, every document requires an immutable `_id` field that functions as the primary key. If not provided during insert, MongoDB generates a 12-byte ObjectId automatically.',
    category: 'MongoDB & Databases',
    difficulty: 'easy',
  },
  {
    questionText: 'In Express.js, what does calling `next()` inside a custom middleware function do?',
    codeSnippet: 'const logger = (req, res, next) => {\n  console.log(req.path);\n  next();\n};',
    options: [
      'Immediately sends the HTTP response to the client',
      'Passes execution control to the next middleware or route handler in the pipeline',
      'Restarts the Express application worker process',
      'Rolls back the current database transaction',
    ],
    correctOptionIndex: 1,
    explanation: 'Calling next() hands off execution to the next matching middleware or route handler in the Express stack. Omitting next() hangs the request unless a response is sent.',
    category: 'Node.js & Express',
    difficulty: 'medium',
  },
  {
    questionText: 'What will be the output of the following JavaScript snippet due to event loop queue priorities?',
    codeSnippet: 'console.log("A");\nsetTimeout(() => console.log("B"), 0);\nPromise.resolve().then(() => console.log("C"));\nconsole.log("D");',
    options: ['A, B, C, D', 'A, D, B, C', 'A, D, C, B', 'D, A, C, B'],
    correctOptionIndex: 2,
    explanation: 'Synchronous statements run first ("A", "D"). Then microtasks like Promise callbacks run before macrotasks (setTimeout), resulting in "C" before "B". Final output: A, D, C, B.',
    category: 'JavaScript Core',
    difficulty: 'medium',
  },
  {
    questionText: 'In React, what is the key difference between `useCallback` and `useMemo`?',
    codeSnippet: 'const memoizedFn = useCallback(fn, deps);\nconst memoizedVal = useMemo(() => compute(a), [a]);',
    options: [
      'useCallback memoizes a function instance; useMemo memoizes the computed return value',
      'useCallback only runs on server-side rendering',
      'useMemo can only be used with primitive numbers and booleans',
      'There is no technical difference; they are aliases',
    ],
    correctOptionIndex: 0,
    explanation: 'useCallback(fn, deps) caches a function instance across renders to prevent unnecessary re-creations, while useMemo(() => fn(), deps) caches the computed result value of an expensive calculation.',
    category: 'React & Frontend',
    difficulty: 'medium',
  },
  {
    questionText: 'Which HTTP status code should a RESTful API return when a client request fails due to missing or invalid authentication credentials?',
    codeSnippet: 'HTTP/1.1 ___ Unauthorized\nWWW-Authenticate: Bearer realm="Access to API"',
    options: ['400 Bad Request', '401 Unauthorized', '403 Forbidden', '404 Not Found'],
    correctOptionIndex: 1,
    explanation: 'HTTP 401 Unauthorized indicates that the request lacks valid authentication credentials. 403 Forbidden means the server recognizes identity but refuses authorization.',
    category: 'Web Architecture',
    difficulty: 'easy',
  },
  {
    questionText: 'What is the primary role of a JSON Web Token (JWT) signature?',
    codeSnippet: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyJ9.SIGNATURE',
    options: [
      'To encrypt the payload so client cannot read JSON data',
      'To verify that the sender of the JWT is who it says it is and ensure message integrity',
      'To compress the token string to reduce HTTP header size',
      'To automatically expire MongoDB session cookies',
    ],
    correctOptionIndex: 1,
    explanation: 'The JWT signature is calculated using header, payload, and a secret key. It guarantees that the payload has not been tampered with or modified in transit.',
    category: 'Web Security',
    difficulty: 'medium',
  },
  {
    questionText: 'In Node.js, what is the role of the Libuv library?',
    codeSnippet: 'fs.readFile("test.txt", (err, data) => {\n  /* async I/O */\n});',
    options: [
      'Compiles TypeScript directly to machine code',
      'Provides the multi-platform C library supporting asynchronous I/O and the event loop',
      'Generates CSS stylesheets dynamically for SSR',
      'Manages WebSocket socket rooms natively',
    ],
    correctOptionIndex: 1,
    explanation: 'Libuv is the multi-platform C support library used by Node.js to implement the event loop, thread pool, async DNS resolution, and non-blocking file/network I/O.',
    category: 'Node.js & Express',
    difficulty: 'hard',
  },
  {
    questionText: 'Why should passwords NEVER be stored as plain text or simple MD5 hashes in MongoDB?',
    codeSnippet: 'const hash = await bcrypt.hash(password, 10);',
    options: [
      'MongoDB collections do not support string types longer than 8 characters',
      'Plaintext and MD5 hashes are vulnerable to rainbow table attacks and credential leaks; salt-and-hashed bcrypt is required',
      'Browsers automatically reject plain text fields over HTTPS',
      'Hashed passwords take up zero disk space in BSON format',
    ],
    correctOptionIndex: 1,
    explanation: 'Plaintext passwords pose fatal security risks. MD5 is computationally trivial to crack with modern rainbow tables. Adaptive algorithms with salts like bcrypt protect against brute force.',
    category: 'Web Security',
    difficulty: 'easy',
  },
  {
    questionText: 'What does the JavaScript spread operator `...` do when updating state in React?',
    codeSnippet: 'setUser(prev => ({ ...prev, score: 100 }));',
    options: [
      'Directly mutates the original object in memory',
      'Creates a shallow copy of existing properties while allowing specific fields to be overridden immutably',
      'Performs deep serialization through JSON stringify',
      'Converts the object into an indexed array',
    ],
    correctOptionIndex: 1,
    explanation: 'In React, state must never be mutated directly. The spread syntax shallow-copies existing keys into a fresh object reference, allowing safe immutable state updates.',
    category: 'React & Frontend',
    difficulty: 'easy',
  },
  {
    questionText: 'In CSS Flexbox, what does `justify-content: space-between;` do?',
    codeSnippet: '.navbar {\n  display: flex;\n  justify-content: space-between;\n}',
    options: [
      'Centers all flex items along the cross axis',
      'Distributes flex items evenly along the main axis, with the first item on the start edge and the last on the end edge',
      'Adds equal space around the outside of all flex items',
      'Forces all flex items to wrap onto the next line',
    ],
    correctOptionIndex: 1,
    explanation: 'space-between puts the first child at the very start, the last child at the very end, and divides all remaining free space equally between the intermediate children.',
    category: 'Full-Stack Web Development',
    difficulty: 'easy',
  },
  {
    questionText: 'What is a closure in JavaScript?',
    codeSnippet: 'function createCounter() {\n  let count = 0;\n  return () => ++count;\n}',
    options: [
      'A method that terminates an active browser worker thread',
      'The combination of a function bundled together with references to its lexical environment',
      'A syntax error caused by unmatched curly brackets',
      'A loop that terminates automatically after 100 iterations',
    ],
    correctOptionIndex: 1,
    explanation: 'A closure gives an inner function access to its outer enclosing scope even after the outer function has finished executing.',
    category: 'JavaScript Core',
    difficulty: 'medium',
  },
];

async function seedDatabase() {
  try {
    const mongoUri =
      process.env.MONGODB_URI ||
      'mongodb+srv://<username>:<password>@cluster0.mongodb.net/mini-online-test?retryWrites=true&w=majority';

    if (!process.env.MONGODB_URI) {
      console.log('⚠️  No MONGODB_URI found in server/.env. Seeding aborted.');
      return;
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // Seed questions
    const existingQuestions = await Question.countDocuments();
    if (existingQuestions === 0) {
      await Question.insertMany(sampleQuestions);
      console.log(`✅ Seeded ${sampleQuestions.length} questions into database.`);
    } else {
      console.log(`ℹ️ Database already contains ${existingQuestions} questions.`);
    }

    // Seed Demo Student
    const existingStudent = await User.findOne({ email: 'student@infinity.com' });
    if (!existingStudent) {
      await User.create({
        name: 'Demo Student',
        email: 'student@infinity.com',
        password: 'student123',
        role: 'student',
      });
      console.log('✅ Created demo student: student@infinity.com / student123');
    }

    // Seed Demo Admin
    const existingAdmin = await User.findOne({ email: 'admin@infinity.com' });
    if (!existingAdmin) {
      await User.create({
        name: 'Admin Instructor',
        email: 'admin@infinity.com',
        password: 'admin123',
        role: 'admin',
      });
      console.log('✅ Created demo admin: admin@infinity.com / admin123');
    }

    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { sampleQuestions, seedDatabase };

