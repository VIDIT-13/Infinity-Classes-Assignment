# 🎓 Infinity Quiz — Mini Online Test Application (MERN)

> A modern, responsive, high-performance online test and assessment application built with **MongoDB, Express.js, React, and Node.js (MERN)**. Crafted for Infinity Classes internship assignment.

---

## 🚀 Live Demo & Repository

- **Live Application URL:** [https://infinity-classes-quiz.onrender.com](https://infinity-classes-quiz.onrender.com) *(or your deployed Render/Vercel URL)*
- **GitHub Repository:** [https://github.com/viditallen/InfinityClassesAssignment](https://github.com/viditallen/InfinityClassesAssignment)

### ⚡ Quick Demo Credentials (1-Click Fill available in the UI)
| Role | Email | Password | Access Level |
|---|---|---|---|
| **Student (Default)** | `student@infinity.com` | `student123` | Take tests, view real-time countdown, review results, view history |
| **Admin (Bonus Feature)** | `admin@infinity.com` | `admin123` | Add questions with live preview, view bank, delete questions |

---

## ✨ Features Implemented

### 1. 🔐 Student Authentication & Security
- **Signup & Login:** Complete registration and login system with client & server-side validation.
- **Security Best Practices:** Passwords hashed using `bcryptjs` (salt rounds: 10), stateless authentication powered by signed `jsonwebtoken` (JWT), and route-level protection middleware.
- **Role-Based Access:** Distinct student and instructor/admin roles.
- **1-Click Demo Buttons:** Quick-fill buttons for both Demo Student and Demo Admin so reviewers can test in seconds.

### 2. 📝 Real-Time Test Screen (10 Questions)
- **10 Multiple Choice Questions:** Dynamically loaded from MongoDB database with questions spanning React, Node.js, JavaScript Event Loop, CSS Flexbox, and Web Security.
- **Anti-Cheating Security:** Question endpoint strips `correctOptionIndex` and `explanation` server-side, preventing students from inspecting network response payloads to find answers.
- **Syntax Highlighting:** Code blocks with dark-mode styling for programming questions.
- **Interactive Question Palette:** Visual 10-grid palette showing real-time states (Green = Answered, Gray = Unanswered, Amber = Marked for Review, Glowing Ring = Current Question).
- **Keyboard Shortcuts:** Fast keyboard navigation (`1`-`4` or `A`-`D` to select, `N` for Next, `P` for Previous, `M` to Mark for Review).
- **Review System:** Students can flag questions with "Mark for Review" to revisit before submission.

### 3. ⏳ 10-Minute Countdown Timer & Auto-Submit
- **Countdown Display:** 10:00 countdown clock with dynamic visual urgency:
  - 🟢 **Normal (> 3 min):** Emerald indicator
  - 🟡 **Warning (1 - 3 min):** Amber indicator
  - 🔴 **Urgent (< 1 min):** Pulsing crimson alert with warning icon
- **Audio Ticks:** Audible countdown ticks when under 10 seconds.
- **Automatic Auto-Submission:** Automatically evaluates and submits answers when the timer reaches `00:00`.
- **Pre-Submit Confirmation Modal:** Shows answered vs unanswered question count before final confirmation.

### 4. 📊 Instant Result & Comprehensive Breakdown
- **Instant Server-Side Evaluation:** Answers evaluated and scored securely on the backend.
- **Celebration Confetti:** Canvas-confetti celebration fireworks on scores $\ge 70\%$.
- **Animated SVG Score Wheel:** Percentage dial, points fraction (e.g. 8/10), and motivational rank badge (*"Perfectionist Mastery"*, *"Proficient Scholar"*).
- **Detailed Question Review:**
  - Student's selected option vs the verified correct option.
  - Color-coded badges: Correct, Incorrect, Unanswered.
  - Comprehensive explanation for every question explaining the underlying concept.
  - Filter tabs: *All (10)*, *Correct*, and *Mistakes*.

### 5. 📜 Past Attempts History
- **Lifetime Statistics:** Total tests taken, Personal Best score (points & %), and Average score.
- **Chronological History Log:** Shows all previous test attempts with score badges, formatted date, exact time, and duration taken.
- **Detailed Review Mode:** Click *"Review Test"* on any past attempt to reload its full question-by-question breakdown.

### 6. 🛠️ Admin Question Management (Bonus Feature)
- **Question Authoring Suite:** Simple, intuitive admin form to add new multiple-choice questions.
- **Fields Supported:** Question prompt, optional code snippet, 4 options with radio selector for correct answer, category, difficulty level, and answer explanation.
- **Question Bank Viewer:** Displays all active questions in the database with option keys and delete capability.

---

## 🎨 Design Philosophy & UX Highlights

- **Anti-AI Boilerplate Aesthetic:** Tailored deep-slate midnight palette (`#020617` / `#0f172a`), accented with electric violet (`#8b5cf6`), glowing emerald, and amber alerts.
- **Native Web Audio Synthesizer:** Built-in Web Audio API sound effects (pleasant selection pop, countdown warning ticks, celebratory victory chime) without external MP3 assets, with a persistent mute toggle in the navbar.
- **Responsive Layout:** Optimized for mobile phones, tablets, and desktop displays.

---

## 📂 Project Architecture

```
InfinityClassesAssignment/
├── client/                     # Frontend (React 18 + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js          # Centralized API service wrapper
│   │   ├── components/
│   │   │   ├── ConfirmModal.jsx# Pre-submit confirmation modal
│   │   │   ├── Navbar.jsx      # Sticky glowing navigation & sound toggle
│   │   │   ├── ProtectedRoute.jsx # Session & role route guard
│   │   │   ├── QuestionPalette.jsx # 1-10 interactive question grid
│   │   │   └── Timer.jsx       # 10-minute animated countdown
│   │   ├── context/
│   │   │   ├── AuthContext.jsx # User auth, token & role management
│   │   │   └── TestContext.jsx # Test runtime, timer & answer state
│   │   ├── pages/
│   │   │   ├── AdminPage.jsx   # Bonus question authoring & bank manager
│   │   │   ├── AuthPage.jsx    # Login / Register with 1-click demo fill
│   │   │   ├── DashboardPage.jsx # Student hub & stats overview
│   │   │   ├── HistoryPage.jsx # Past test attempts log
│   │   │   ├── ResultPage.jsx  # Score, confetti & detailed analysis
│   │   │   └── TestPage.jsx    # Active examination screen
│   │   ├── utils/
│   │   │   └── soundEffects.js # Web Audio API sound synthesizer
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                     # Backend API (Node.js + Express + Mongoose)
│   ├── config/
│   │   └── db.js               # MongoDB connection handler
│   ├── controllers/
│   │   ├── authController.js   # Register, Login, Me endpoints
│   │   ├── questionController.js # Sanitized test fetching & admin CRUD
│   │   └── testController.js   # Scoring, attempt creation & history
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT verification middleware
│   │   └── adminMiddleware.js  # Role check middleware
│   ├── models/
│   │   ├── Question.js         # Question schema
│   │   ├── TestAttempt.js      # Student test submission schema
│   │   └── User.js             # User & credentials schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── questionRoutes.js
│   │   └── testRoutes.js
│   ├── seeds/
│   │   └── seedQuestions.js    # 12+ pre-populated questions & demo accounts
│   ├── .env.example
│   ├── package.json
│   └── server.js               # Express application entrypoint
├── package.json                # Monorepo build and run scripts
├── README.md
└── .gitignore
```

---

## 🛠️ Local Setup & Installation

### Prerequisites
- **Node.js** (v18 or v20+ recommended)
- **MongoDB Atlas** connection string or local MongoDB instance

### Step 1: Clone the repository
```bash
git clone https://github.com/viditallen/InfinityClassesAssignment.git
cd InfinityClassesAssignment
```

### Step 2: Install dependencies
Install dependencies for both client and server:
```bash
npm run install-all
```
*(or run `cd server && npm install && cd ../client && npm install`)*

### Step 3: Configure Environment Variables
Inside `server/`, create a `.env` file (you can copy from `server/.env.example`):
```bash
PORT=5001
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/mini-online-test?retryWrites=true&w=majority
JWT_SECRET=infinity_classes_super_secure_jwt_secret_2026
NODE_ENV=development
```
> Replace `<username>` and `<password>` with your MongoDB Atlas credentials.

### Step 4: Seed Initial Questions & Demo Accounts
Run the seed script to populate 12+ questions and create demo student/admin users:
```bash
npm run seed
```

### Step 5: Start Development Servers
Run the backend and frontend:
```bash
# Terminal 1 - Backend Server (runs on http://localhost:5001)
npm run server

# Terminal 2 - Frontend Client (runs on http://localhost:3000)
npm run client
```

Open your browser at **`http://localhost:3000`** to start testing!

---

## 🌐 Deployment Instructions (Render / Railway / Vercel)

This project is pre-configured for simple full-stack deployment on **Render**:

1. Push your repository to **GitHub**.
2. Go to [Render Dashboard](https://dashboard.render.com/) and click **New Web Service**.
3. Connect your GitHub repository.
4. Set the following build and start settings:
   - **Environment:** `Node`
   - **Build Command:** `npm run install-all && npm run build`
   - **Start Command:** `npm start`
5. Add the Environment Variables:
   - `MONGODB_URI` = `your_mongodb_atlas_connection_string`
   - `JWT_SECRET` = `your_jwt_secret_string`
   - `NODE_ENV` = `production`
   - `PORT` = `10000` *(Render sets this automatically)*
6. Click **Deploy Web Service**. Once deployed, Render will provide a live link.
7. Open the live link, click **Demo Student** or **Demo Admin**, and the question bank will automatically self-seed!

---

## 🧪 Evaluation Test Plan & Checklist

- [x] **Login / Signup:** Student registration and login with bcrypt hashing & JWT.
- [x] **10 Questions Screen:** Randomized 10 questions loaded from MongoDB.
- [x] **Timer:** 10-minute countdown with urgency indicators.
- [x] **Auto-Submit:** Triggers automatically at 00:00.
- [x] **Result Screen:** Instant score percentage, right/wrong breakdown, and verified explanations.
- [x] **History Screen:** Chronological log of student attempts with date, score, and review button.
- [x] **Bonus Admin Feature:** Add questions with category, difficulty, explanation, and live list.
- [x] **Student-Centric UI:** Dark-mode glassmorphic design, sound effects toggle, keyboard shortcuts, and confetti celebration.

---

### Author
**Vidit** — Internship Candidate for Infinity Classes  
Submission Date: November 2026
