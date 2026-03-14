# 🎬 YouTube Clone — MERN Stack Capstone Project

A full-stack YouTube clone built with MongoDB, Express, React, and Node.js.

---

## 📁 Project Structure

```
YoutubeClone/
├── backend/                          ← Node.js + Express + MongoDB API
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── channelController.js
│   │   ├── commentController.js
│   │   └── videoController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── validationMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Channel.js
│   │   └── Video.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── channelRoutes.js
│   │   └── videoRoutes.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── seeder.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/                         ← React + Vite + Redux + Tailwind
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── .env
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── api/
        │   └── axios.js
        ├── context/
        │   └── ThemeContext.jsx
        ├── hooks/
        │   └── useDebounce.js
        ├── utils/
        │   └── formatters.js
        ├── store/
        │   ├── store.js
        │   └── slices/
        │       ├── authSlice.js
        │       ├── videoSlice.js
        │       └── channelSlice.js
        ├── components/
        │   ├── layout/
        │   │   ├── Header.jsx
        │   │   ├── Sidebar.jsx
        │   │   └── Layout.jsx
        │   ├── common/
        │   │   ├── VideoCard.jsx
        │   │   ├── CategoryFilter.jsx
        │   │   ├── Loader.jsx
        │   │   ├── ProtectedRoute.jsx
        │   │   └── Avatar.jsx
        │   └── video/
        │       ├── VideoPlayer.jsx
        │       ├── LikeDislikeButtons.jsx
        │       └── CommentSection.jsx
        └── pages/
            ├── Home.jsx
            ├── VideoPage.jsx
            ├── SearchPage.jsx
            ├── Login.jsx
            ├── Register.jsx
            ├── ChannelPage.jsx
            ├── MyChannel.jsx
            ├── UploadVideo.jsx
            └── NotFound.jsx
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| State Management | Redux Toolkit |
| Routing | React Router DOM v6 |
| UI Context | Context API (sidebar + theme) |
| Styling | Tailwind CSS |
| HTTP Client | Axios (with interceptors) |
| Notifications | React Toastify |
| Icons | React Icons |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT + bcryptjs |
| Validation | express-validator |

---

## 🚀 How to Initialize & Run the Project

### Prerequisites — Install these first

- Node.js v18+ → https://nodejs.org
- MongoDB Community → https://www.mongodb.com/try/download/community
- Git → https://git-scm.com

---

### Step 1 — Clone or Download the Project

```bash
git clone https://github.com/Gokulmlk/Youtube_clone.git
cd Youtube_clone

```

---

### Step 2 — Setup Backend

```bash
cd backend
npm install
```

Create the `.env` file inside the `backend/` folder:

```env
PORT:3000
MONGO_URI=mongodb://localhost:27017/youtube-clone
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

---

### Step 3 — Start MongoDB

**Windows (run as Administrator):**
```bash
net start MongoDB
```

**Mac:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

---

### Step 4 — Seed the Database

```bash
cd backend
npm run seed
```

This creates sample data automatically:

```
✅ Created 3 users
✅ Created 3 channels
✅ Created 12 videos with comments
```

**Test accounts after seeding:**

| Email | Password |
|-------|----------|
| john@example.com | Password123 |
| jane@example.com | Password123 |
| devguru@example.com | Password123 |

---

### Step 5 — Setup Frontend

Open a new terminal:

```bash
cd frontend
npm install
```

Create the `.env` file inside the `frontend/` folder:

```env
VITE_API_URL=http://localhost:3000/api
```

---

### Step 6 — Run Both Servers

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# ✅ Running at http://localhost:3000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# ✅ Running at http://localhost:5173
```

Open your browser at: **http://localhost:5173**

---

## ✅ Features

### 🔐 Authentication
- Register with username, email, password
- Login with JWT token (stored in localStorage)
- Auto-redirect after login/register
- Protected routes — redirects to login if not authenticated
- Logout clears token and Redux state

### 🏠 Home Page
- Loads all videos from MongoDB
- Category filter bar — 14 categories
- Loading skeleton cards while fetching
- Responsive grid (1 → 4 columns based on screen size)

### 🎥 Video Page
- Custom video player (MP4 + YouTube embed support)
- Like / Dislike toggle (mutually exclusive)
- View count auto-increments on page visit
- Share button — copies URL to clipboard
- Comment CRUD — Add, Edit, Delete comments
- Related videos sidebar
- Video owner sees Edit + Delete buttons

### 🔍 Search Page
- Search videos by title
- Result count displayed

### 📺 Channel Page
- Channel banner, avatar, subscriber count
- Subscribe / Unsubscribe toggle
- Subscribed state persists in localStorage
- Channel video grid
- Owner sees Manage Channel button

### 🎛️ My Channel Dashboard
- Create multiple channels (modal form with avatar upload)
- Edit channel name, description, avatar
- Delete channel (cascades and removes all videos)
- Video management table with edit and delete
- Click video row → opens video page
- Click channel name/arrow → opens public channel page

### 📤 Upload / Edit Video
- Title, description, video URL, thumbnail URL
- Category dropdown (13 categories)
- Channel selector (from your own channels)
- Duration field
- Public / Private toggle
- Edit mode pre-fills existing video data
- Live thumbnail preview

### 🌙 Dark / Light Mode
- Toggle button in header
- Preference saved in localStorage
- Persists across page refresh

### 📱 Sidebar + Header
- Hamburger toggle (ThemeContext)
- Search bar with voice icon
- Upload button in header
- User avatar dropdown menu (Sign In / Sign Out / My Channel)
- Category quick links in sidebar

---

## 🌐 API Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| GET | /api/health | ❌ | Health check |
| POST | /api/auth/register | ❌ | Register |
| POST | /api/auth/login | ❌ | Login |
| GET | /api/auth/me | ✅ | Get profile |
| PUT | /api/auth/update-profile | ✅ | Update profile |
| GET | /api/channels | ❌ | All channels |
| POST | /api/channels | ✅ | Create channel |
| PUT | /api/channels/:id/subscribe | ✅ | Subscribe toggle |
| GET | /api/videos | ❌ | All videos (search/filter/sort/paginate) |
| GET | /api/videos/:id | ❌ | Single video + view++ |
| POST | /api/videos | ✅ | Upload video |
| PUT | /api/videos/:id/like | ✅ | Like toggle |
| PUT | /api/videos/:id/dislike | ✅ | Dislike toggle |
| GET | /api/videos/:id/comments | ❌ | Get comments |
| POST | /api/videos/:id/comments | ✅ | Add comment |
| PUT | /api/videos/:id/comments/:cid | ✅ | Edit comment |
| DELETE | /api/videos/:id/comments/:cid | ✅ | Delete comment |

---

## 🛠️ Troubleshooting

### MongoDB won't start (Windows)
```bash
# Run PowerShell as Administrator, then:
net start MongoDB

# Or start manually:
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath "C:\data\db"
```

### Port:3000 already in use
```bash
# Mac/Linux:
lsof -ti:3000 | xargs kill

# Windows:
netstat -ano | findstr :3000
taskkill /PID <pid> /F
```

### Frontend shows blank page
- Make sure backend is running at port:3000
- Check `.env` file exists in frontend folder
- Check `VITE_API_URL=http://localhost:3000/api` is set correctly

### Videos not loading
```bash
# Re-seed the database:
cd backend
npm run seed
```

### JWT errors / getting logged out
- Token expires after 7 days — just log in again
- Check `yt_token` exists in browser → DevTools → Application → Local Storage

---

## 📦 All npm Packages Used

### Backend
```bash
npm install express mongoose dotenv cors bcryptjs jsonwebtoken express-validator morgan multer
npm install -D nodemon
```

### Frontend
```bash
npm install @reduxjs/toolkit react-redux react-router-dom axios react-toastify react-icons timeago.js
npm install tailwindcss 