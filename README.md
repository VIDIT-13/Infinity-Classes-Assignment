<p align="center">
  <img src="./client/public/logo.png" width="120" alt="Infinity Classes Logo" />
</p>

# 🎓 Infinity Classes — Class 10 CBSE Science Online Test Application (MERN)

> A modern, responsive, high-performance online examination and assessment portal tailored for **Infinity Classes (Alpha 1, Greater Noida)**. Built with **MongoDB, Express.js, React, and Node.js (MERN)** for Class 10 CBSE Board Science students (Physics, Chemistry & Biology).

---

## 🏛️ About Infinity Classes
- **Mission:** Making learning simple, engaging, and result-oriented through concept-based teaching, personalized mentorship, and modern technology.
- **Programs:** Classes 6 to 12 (CBSE & ICSE), IIT-JEE, NEET, CUET, Olympiads, and Foundation Courses.
- **Location:** Alpha 1, Greater Noida &bull; *Learn Beyond Limits*

---

## 🚀 Live Demo & Repository

- **Live Application URL:** [https://infinity-classes-assignment.vercel.app]
 *(or your deployed Render URL)*
- **GitHub Repository:** [https://github.com/VIDIT-13/Infinity-Classes-Assignment](https://github.com/VIDIT-13/Infinity-Classes-Assignment)

### ⚡ Quick Demo Credentials (1-Click Fill available in UI)
| Role | Email | Password | Access Level |
|---|---|---|---|
| **Student (Default)** | `student@infinity.com` | `student123` | Take 10-min CBSE Science test, view countdown, review score & NCERT solutions, view history |
| **Faculty / Admin (Bonus)** | `admin@infinity.com` | `admin123` | Add new questions with formulas/diagrams, view bank, delete questions |

---

## ✨ Features Implemented

### 1. 🔐 Student Authentication & Security
- **Signup & Login:** Complete student registration and login with email & password validation.
- **Security:** Passwords hashed using `bcryptjs` (salt rounds: 10), stateless authentication powered by `jsonwebtoken` (JWT), and route-level protection middleware.
- **Role-Based Access:** Distinct student and instructor/admin roles.
- **1-Click Demo Buttons:** Quick-fill buttons for both Student and Faculty/Admin.

### 2. 🔬 Test Screen: 10 Class 10 CBSE Science Questions
- **10 Multiple Choice Questions:** Dynamically drawn from MongoDB Atlas spanning:
  - **Chemistry:** Chemical Reactions & Equations, Acids Bases & Salts, Metals & Non-Metals, Carbon & its Compounds.
  - **Physics:** Light: Reflection & Refraction, Electricity, Magnetic Effects of Electric Current.
  - **Biology:** Life Processes (Nutrition, Respiration, Excretion), Control & Coordination, Heredity.
- **Chemical Reactions & Formulas:** Clear equation contexts (e.g. $Fe + 2HCl \rightarrow FeCl_2 + H_2 \uparrow$, $1/R_{eq} = 1/R_1 + 1/R_2 + 1/R_3$).
- **Anti-Cheating Security:** Server sanitizes questions, stripping `correctOptionIndex` and `explanation` so students cannot view answers in browser DevTools.
- **Interactive Question Palette:** Visual 10-grid palette showing real-time states (Green = Answered, Gray = Unanswered, Amber = Marked for Review, Glowing Ring = Current Question).
- **Keyboard Shortcuts:** Fast keyboard navigation (`1`-`4` or `A`-`D` to select, `N` for Next, `P` for Previous, `M` to Mark for Review).

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
  - Comprehensive explanation for every question explaining the underlying concept based on CBSE marking schemes.
  - Filter tabs: *All (10)*, *Correct*, and *Mistakes*.

### 5. 📜 Past Attempts History
- **Lifetime Statistics:** Total tests taken, Personal Best score (points & %), and Average score.
- **Chronological History Log:** Shows all previous test attempts with score badges, formatted date, exact time, and duration taken.
- **Detailed Review Mode:** Click *"Review Test"* on any past attempt to reload its full question-by-question breakdown.

### 6. 🛠️ Admin Question Management (Bonus Feature)
- **Question Authoring Suite:** Intuitive admin form to add new multiple-choice questions for Class 10 Science.
- **Fields Supported:** Question prompt, chemical equation / formula context, 4 options with radio selector for correct answer, category (Physics / Chemistry / Biology), difficulty level, and answer explanation.
- **Question Bank Viewer:** Displays all active questions in the database with option keys and delete capability.

---

## 🛠️ Local Setup & Installation

### Prerequisites
- **Node.js** (v18 or v20+ recommended)
- **MongoDB Atlas** connection string

### Step 1: Clone the repository
```bash
git clone https://github.com/viditallen/InfinityClassesAssignment.git
cd InfinityClassesAssignment
```

### Step 2: Install dependencies
```bash
npm run install-all
```

### Step 3: Configure Environment Variables
Inside `server/.env`:
```bash
PORT=5001
MONGODB_URI=mongodb+srv://viditallen4:YO11Y7a0pVfpXuoq@cluster0.djqlgs9.mongodb.net/mini-online-test?retryWrites=true&w=majority
JWT_SECRET=infinity_classes_super_secure_jwt_secret_2026
NODE_ENV=development
```

### Step 4: Seed Class 10 CBSE Science Questions
```bash
npm run seed
```

### Step 5: Start Development Servers
```bash
# Terminal 1 - Backend Server (runs on http://localhost:5001)
npm run server

# Terminal 2 - Frontend Client (runs on http://localhost:3000)
npm run client
```

Open your browser at **`http://localhost:3000`** to start testing!

---

## 🧪 Evaluation Test Plan & Checklist

- [x] **Login / Signup:** Student registration and login with bcrypt hashing & JWT.
- [x] **10 Questions Screen:** 10 questions for Class 10 CBSE Board Science loaded from MongoDB.
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
