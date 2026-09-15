# 💡 LantroSpark — Enterprise AI-Powered Innovation Platform

> **An internal innovation incubator for Lantrotech engineers and teams to pitch ideas, gather peer backing, and leverage Google Gemini AI for automated strategic evaluations and executive decision-making.**

---

## 📑 Table of Contents
- [Overview](#-overview)
- [System Architecture & File Structure](#-system-architecture--file-structure)
- [Tech Stack](#-tech-stack)
- [Key Features & Capabilities](#-key-features--capabilities)
  - [Interactive Landing Page](#1-interactive-landing-page)
  - [Idea Exploration & Dedicated My Ideas](#2-idea-exploration--dedicated-my-ideas)
  - [Multi-Step Proposal Submission](#3-multi-step-proposal-submission)
  - [Admin Command Center & Kanban Pipeline](#4-admin-command-center--kanban-pipeline)
  - [Google Gemini AI Insights Engine](#5-google-gemini-ai-insights-engine)
- [Security & Role-Based Access Control (RBAC)](#-security--role-based-access-control-rbac)
- [Local Setup & Development](#-local-setup--development)
- [Production Deployment (Vercel)](#-production-deployment-vercel)

---

## 🌟 Overview

**LantroSpark** bridges the gap between grassroots employee innovation and executive project funding. It empowers team members to submit structured technical and business proposals, gather peer endorsements, and engage in threaded discussions. 

Administrators manage proposals through an interactive 5-stage Kanban pipeline and trigger **Google Gemini AI** to automatically evaluate feasibility, analyze monetization potential, highlight risks, recommend modern tech stacks, and rank top proposals.

---

## 🗂 System Architecture & File Structure

The project is architected as a modern, decoupled monorepo containing a high-performance **React + Vite** frontend and a dedicated **Express / Serverless** proxy backend.

```
LantroCodingChallenge/
├── frontend/                               # React (Vite) Single Page Application
│   ├── public/                             # Static assets & icons
│   ├── src/
│   │   ├── assets/                         # SVG icons and visual media
│   │   ├── components/                     # Reusable UI components
│   │   │   ├── IdeaCard.jsx                # Proposal summary card with status badges
│   │   │   ├── IdeaCard.css                # Idea card styling
│   │   │   ├── Navbar.jsx                  # Top navigation with role links & theme switcher
│   │   │   ├── Navbar.css                  # Navbar styles & active link indicators
│   │   │   └── ProtectedRoute.jsx          # Route guard for Auth & Admin verification
│   │   ├── context/
│   │   │   └── AuthContext.jsx             # Firebase auth state & user profile provider
│   │   ├── pages/                          # Application view pages
│   │   │   ├── Landing.jsx                 # Public landing page with interactive pipeline
│   │   │   ├── Landing.css                 # Hero, preview card & firework animation styles
│   │   │   ├── Login.jsx                   # User authentication & password visibility toggle
│   │   │   ├── Register.jsx                # Account creation with role provisioning
│   │   │   ├── Auth.css                    # Shared authentication styles
│   │   │   ├── IdeasFeed.jsx               # Global feed with multi-criteria search & filters
│   │   │   ├── IdeasFeed.css               # Feed & filter bar styling
│   │   │   ├── MyIdeas.jsx                 # Personal submitted ideas portal with live metrics
│   │   │   ├── MyIdeas.css                 # Personal ideas portal styling
│   │   │   ├── SubmitIdea.jsx              # 3-step structured pitch submission with file upload
│   │   │   ├── SubmitIdea.css              # Stepper form styling
│   │   │   ├── IdeaDetail.jsx              # Idea deep dive, voting, and comments thread
│   │   │   ├── IdeaDetail.css              # Detail page & discussion styling
│   │   │   ├── AdminDashboard.jsx          # Executive dashboard & 5-stage Kanban board
│   │   │   ├── AdminDashboard.css          # Kanban board & KPI card styling
│   │   │   ├── AIInsights.jsx              # Executive AI analytics, Top 3 picks & pros/cons
│   │   │   └── AIInsights.css              # AI diagnostics & tech stack tags styling
│   │   ├── services/                       # Client-side API & Firebase integration
│   │   │   ├── firebase.js                 # Firebase App, Auth, Firestore & Storage init
│   │   │   ├── auth.service.js             # User login, registration, and profile queries
│   │   │   ├── ideas.service.js            # Firestore queries, real-time listeners & voting
│   │   │   └── ai.service.js               # Communication with backend Gemini proxy
│   │   ├── App.jsx                         # Main Router & Toaster notification config
│   │   ├── App.css                         # Global layout utilities
│   │   ├── index.css                       # Design tokens, variables & glassmorphic themes
│   │   └── main.jsx                        # DOM entry point
│   ├── .env.example                        # Example frontend environment variables
│   ├── index.html                          # HTML5 template
│   ├── package.json                        # Frontend dependencies & scripts
│   ├── vercel.json                         # Vercel SPA client-side rewrite config
│   └── vite.config.js                      # Vite bundler configuration
│
├── backend/                                # Node.js Express & Serverless AI Proxy
│   ├── src/
│   │   ├── routes/
│   │   │   └── insights.js                 # POST /api/insights route handler
│   │   ├── services/
│   │   │   └── gemini.service.js           # Gemini 1.5 API client, prompts & fallback engine
│   │   └── server.js                       # Express app, CORS middleware & health check
│   ├── .env.example                        # Example backend environment variables
│   ├── package.json                        # Backend dependencies & scripts
│   └── vercel.json                         # Vercel Node serverless function configuration
│
└── README.md                               # Project documentation
```

---

## 🚀 Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Routing**: React Router v6 (with `NavLink` active states and `ProtectedRoute` guards)
- **Real-Time Data & Storage**: Firebase SDK v10 (Firestore Real-time Subscriptions, Firebase Storage, Auth)
- **UI & Design System**: Vanilla CSS with CSS Custom Properties, Glassmorphism, Theme Engine (Dark & Light modes), and Google Fonts (*Inter*)
- **Notifications**: React Hot Toast
- **Design Tokens**: Strict corporate 4-color palette (`#07a389` Teal, `#dbdb35` Yellow, `#ffffff` White, `#000000` Black)

### Backend
- **Runtime**: Node.js (ES Modules)
- **Web Framework**: Express.js
- **AI Model**: Google Gemini API (`gemini-1.5-flash` / `gemini-1.5-pro`)
- **HTTP Client**: Native `fetch` / `node-fetch`
- **Security & Headers**: CORS (`cors`), Environment Management (`dotenv`)

### Cloud & Infrastructure
- **Hosting / Serverless**: Vercel (Frontend SPA + Backend Serverless Node Function)
- **Database**: Google Cloud Firestore (multi-tab persistence enabled)
- **Object Storage**: Google Cloud Firebase Storage
- **Identity & Auth**: Firebase Authentication

---

## ✨ Key Features & Capabilities

### 1. Interactive Landing Page
- **Live Proposal Preview Card**: Interactive hero preview allowing visitors to test the real-time backing mechanism with a custom **fireworks / celebratory particle burst effect**.
- **Interactive 5-Stage Innovation Pipeline**: Stepper interface (*Submitted ➔ Reviewing ➔ Approved ➔ Funding Allocated ➔ Archived*) providing live insights into roles, deliverables, and simulated outcomes.
- **Theme Switcher**: One-click toggle between sleek dark mode and crisp light mode with persistent local storage.

### 2. Idea Exploration & Dedicated "My Ideas"
- **Global Idea Feed**: Filter by Category (*Automation, Product, Tooling, Infrastructure, etc.*), Status, and Priority, or perform full-text search across titles, descriptions, and `#tags`.
- **Dedicated "My Ideas" Portal**: Filtered view showing solely the authenticated user's submitted proposals with live summary cards:
  - 💡 *Total Submitted Ideas*
  - 🚀 *Total Backers / Peer Endorsements*
  - ✅ *Approved & Funded Ideas Count*
  - ⏳ *Ideas Currently In Review*
- **Active Navigation Highlighting**: Clean text color transition and underline indicator for the active route.

### 3. Multi-Step Proposal Submission
- **Structured 3-Step Wizard**:
  1. *Core Concept*: Title, Category, Priority, and `#tags`.
  2. *Business Case & Budget*: Problem statement, Proposed solution, Target impact, Budget estimate, and Team size needed.
  3. *Attachments & Review*: File attachments (PDFs, images, documents uploaded directly to Firebase Storage) and pre-submission validation.

### 4. Admin Command Center & Kanban Pipeline
- **Executive Metrics**: Real-time counts for Total Ideas, Total Backers, Discussion Volume, and Approved Initiatives.
- **5-Stage Kanban Workflow**: Drag-and-drop or select stage transitions (*Submitted ➔ Reviewing ➔ Approved ➔ Funding Allocated ➔ Archived*).
- **Idea Lifecycle Management**: Direct status changes, deletion capabilities, and filtering by priority and budget.

### 5. Google Gemini AI Insights Engine
The admin **AI Insights** suite automatically aggregates live Firestore proposals and generates deep analytics:
- **Top 3 Executive Recommendations**: Highlights the 3 strongest proposals scored on:
  - 💡 *Innovation & Originality*
  - 📈 *Future Monetization Potential & Business Impact*
  - ⚡ *Low Resource & Engineering Overhead*
- **Comprehensive Idea Diagnostics**: For *every* proposal in the platform:
  - 🟢 **Concrete Strengths & Advantages**
  - 🔴 **Weaknesses, Bottlenecks & Operational Risks**
  - 🛠 **Recommended Engineering Tech Stack** (Frontend, Backend, AI/ML, Cloud tools)
- **Live Diagnostics Search**: Instant search and status filtering across all AI-generated analyses.

---

## 🔒 Security & Role-Based Access Control (RBAC)

- **Gemini API Key Isolation**: The `GEMINI_API_KEY` is strictly managed within the backend server environment and is **never** transmitted to or accessible by client browsers.
- **Role Separation**:
  - `EMPLOYEE`: Access to Landing, Global Feed, My Ideas, Idea Submissions, Voting, and Comments.
  - `ADMIN`: Access to Admin Dashboard, Kanban Pipeline, Status Governance, Idea Deletions, and Gemini AI Insights Suite.
- **Firestore Security**: User role metadata is mapped in Firestore and protected via routing guards.

---

## ⚙️ Local Setup & Development

### Prerequisites
- **Node.js** (v18 or higher)
- A **Firebase Project** (with Authentication, Firestore, and Storage enabled)
- A **Google Gemini API Key** (from [Google AI Studio](https://aistudio.google.com/))

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/LantroCodingChallenge.git
cd LantroCodingChallenge
```

---

### Step 2: Configure Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a `.env` file from `.env.example`:
   ```env
   PORT=3001
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```
3. Install dependencies and start the dev server:
   ```bash
   npm install
   npm run dev
   ```
   *The backend will start at `http://localhost:3001`.*

---

### Step 3: Configure Frontend
1. In a new terminal, navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Create a `.env` file from `.env.example`:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_BACKEND_URL=http://localhost:3001
   ```
3. Install dependencies and start the Vite development server:
   ```bash
   npm install
   npm run dev
   ```
   *The frontend will start at `http://localhost:5173`.*

---

### Step 4: Provisioning an Admin Account
1. Open the application in your browser and register a new account at `/register`.
2. Open your **[Firebase Console](https://console.firebase.google.com/)** ➔ **Firestore Database** ➔ `users` collection.
3. Locate your user document and edit the `role` field from `"EMPLOYEE"` to `"ADMIN"`.
4. Refresh the application; the **Dashboard** and **AI Insights** navigation links will now be active.

---

## 🌐 Production Deployment (Vercel)

Both the frontend and backend are configured for zero-friction deployment on **Vercel**.

### 1. Deploy the Backend
1. In **[Vercel Dashboard](https://vercel.com/dashboard)**, click **Add New... ➔ Project** and import the repository.
2. Set **Root Directory** to `backend`.
3. In **Environment Variables**, add:
   - `GEMINI_API_KEY` = `your_gemini_api_key`
4. Click **Deploy** and copy your live backend URL (e.g., `https://lantro-incubator-ten.vercel.app`).

---

### 2. Deploy the Frontend
1. In Vercel, click **Add New... ➔ Project** and import the same repository.
2. Set **Root Directory** to `frontend`.
3. Framework Preset will be automatically detected as **Vite**.
4. In **Environment Variables**, configure:
   - `VITE_BACKEND_URL` = `https://your-backend.vercel.app`
   - `VITE_FIREBASE_API_KEY` = `your_firebase_key`
   - `VITE_FIREBASE_AUTH_DOMAIN` = `your_auth_domain`
   - `VITE_FIREBASE_PROJECT_ID` = `your_project_id`
   - `VITE_FIREBASE_STORAGE_BUCKET` = `your_storage_bucket`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID` = `your_sender_id`
   - `VITE_FIREBASE_APP_ID` = `your_app_id`
5. Click **Deploy**.

---

### 3. Authorize Production Domain in Firebase
1. Navigate to **[Firebase Console](https://console.firebase.google.com/) ➔ Authentication ➔ Settings ➔ Authorized Domains**.
2. Click **Add Domain** and input your frontend Vercel domain (e.g., `your-app.vercel.app`).

---

## 📄 License & Attribution
Developed as part of the **Lantrotech Coding Challenge**. Built with Google Gemini 1.5, Firebase Firestore, and React.js.
