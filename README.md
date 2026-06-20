# 💡 LantroSpark — Internal Idea Incubator Platform

An AI-powered innovation platform for Lantrotech employees to submit, back, and collaborate on ideas — with leadership getting Gemini-driven insights.

---

## 🗂 Project Structure

```
LantroCodingChallenge/
├── frontend/          ← React.js (Vite) — the full UI
│   ├── src/
│   │   ├── components/    (Navbar, IdeaCard, ProtectedRoute)
│   │   ├── context/       (AuthContext)
│   │   ├── pages/         (Landing, Login, Register, IdeasFeed, SubmitIdea, IdeaDetail, AdminDashboard, AIInsights)
│   │   └── services/      (firebase.js, auth.service.js, ideas.service.js, ai.service.js)
│   ├── .env               ← Firebase keys (fill in yours)
│   └── package.json
│
├── backend/           ← Express.js — Gemini AI proxy server
│   ├── src/
│   │   ├── routes/        (insights.js)
│   │   └── services/      (gemini.service.js)
│   ├── src/server.js
│   ├── .env               ← Gemini API key (fill in yours)
│   └── package.json
│
└── README.md
```

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js (Vite) |
| Backend | Node.js + Express |
| Auth | Firebase Authentication |
| Database | Firebase Firestore (real-time) |
| File Storage | Firebase Storage |
| AI | Google Gemini 1.5 Flash (via backend proxy) |
| Styling | Vanilla CSS — dark glassmorphism |

---

## ⚙️ Setup Instructions

### Step 1 — Get a Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"** → Create
3. Go to **Project Settings** → **Your apps** → **Web** (`</>`) → Register app → copy config

Enable these in Firebase console:
- **Authentication** → Sign-in method → **Email/Password** → Enable
- **Firestore Database** → Create database → **Test mode**
- **Storage** → Get started → **Test mode**

---

### Step 2 — Get a Gemini API Key

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Click **"Get API Key"** → **"Create API key"**
3. Copy the key

---

### Step 3 — Configure Environment Variables

**Frontend** — edit `frontend/.env`:
```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_BACKEND_URL=http://localhost:3001
```

**Backend** — edit `backend/.env`:
```env
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=http://localhost:5173
```

> The Gemini API key is **only** in the backend — it's never exposed to the browser.

---

### Step 4 — Install & Run

**Terminal 1 — Backend:**
```bash
cd backend
npm install
npm run dev
# Server starts at http://localhost:3001
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm install
npm run dev
# App starts at http://localhost:5173
```

---

### Step 5 — Make Yourself an Admin

1. Register at `/register`
2. Firebase Console → **Firestore** → `users` collection → find your doc
3. Change `role` from `"EMPLOYEE"` to `"ADMIN"`
4. Refresh — Admin Dashboard and AI Insights will appear in the navbar

---

## 📋 Features

### Employee
- Browse, search, and filter ideas by category, status, priority
- Submit ideas via a 3-step form with file attachments
- Back (vote) ideas — one per user, toggleable
- Comment — real-time updates via Firestore

### Admin (all the above, plus)
- Dashboard with metrics: total ideas, votes, comments, approved count
- Trending ideas (top 3 by votes)
- Kanban pipeline: Reviewing → Approved → Funding Allocated → Archived
- Delete ideas / update status per idea
- AI Insights: ROI scores, theme clusters, resource suggestions (via Gemini)

---

## 🔒 Security

- Firebase keys in `frontend/.env` — standard practice for Firebase web apps
- **Gemini key in `backend/.env` only** — never sent to the browser
- Both `.env` files are in `.gitignore`
