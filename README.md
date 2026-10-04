# 🎓 CampusNumberOne
> **"One Campus. One Platform. Everything Connected."**

CampusNumberOne is an all-in-one full-stack digital campus operating system and social platform built using the modern **MERN stack** (MongoDB, Express.js, React 18, Node.js) with **Socket.IO** real-time communication, **Tailwind CSS**, and **JWT-based role access control**.

---

## 🌟 Key Features

### 🎓 1. Student Ecosystem
* **Personalized Student Dashboard**: Quick access to registered events, joined clubs, latest announcements, recent achievements, and academic attendance/marks overview.
* **Campus Events & Hackathons**: Search, filter by category (Hackathons, Workshops, Technical, Cultural, Sports), 1-click registration with instant digital ticket passes (`C1-TKT-XXXX`), and cancellation.
* **Student Clubs & Societies**: Browse technical guilds (Coding Club, AI/ML Society, Robotics, Photography, E-Cell), view leaders, meeting schedules, photo galleries, and 1-click Join/Leave.
* **Campus Social Feed**: Share projects, ask study questions, upload media, cheer posts with live like counters, threaded comments, and community report flags.
* **Academic Repository & Portals**: Access course lecture slides, syllabi, and lab manuals; view assignments with countdown deadlines; submit solutions and receive faculty grades and feedback.
* **Student Portfolio & Achievements**: Showcase national hackathon wins, AWS/cloud certifications, and internships with certificate previews and celebratory confetti!
* **Real-time Notifications**: Socket.IO push alerts for urgent exams, assignment grading, and event registration confirmations.

### 👩‍🏫 2. Faculty Command Center
* **Event Management**: Create, edit, and publish campus events; inspect registered student rosters with ticket IDs.
* **Course Materials Repository**: Upload subject notes, syllabi, reference handbooks, and lab manuals.
* **Assignment & Grading Portal**: Issue class assignments with deadlines; review attached student files, input numerical marks, and provide personalized feedback.
* **Official Announcements**: Broadcast targeted notices to all students or specific departments with priority levels and pin-to-top controls.

### 🛡️ 3. Executive Admin Console
* **Real-time KPI Dashboards**: Monitor total students, faculty, active events, clubs, posts, and registrations.
* **Interactive Visual Analytics**: 6-month monthly registrations area chart, club membership distribution bar chart, and department student-to-faculty ratio tables powered by Recharts.
* **User Management Directory**: Search and filter students and faculty by department; toggle active/suspended statuses or delete accounts.
* **Campus Moderation Queue**: Review flagged community posts and resolve or remove inappropriate content.
* **Institutional Governance**: Charter new student clubs and manage official broadcast circulars.

---

## 🛠️ Tech Stack

### Frontend
* **React 18** (Vite build tool)
* **Tailwind CSS** (Custom dark navy, cyan, and blue design system)
* **Lucide React** (Modern clean vector iconography)
* **React Router DOM v6** (Nested layouts & role-protected route guards)
* **Axios** (With request/response interceptors for Bearer token handling)
* **Recharts** (Interactive administrative analytics & telemetry charts)
* **Socket.IO Client** (Live WebSocket notifications)
* **Canvas-Confetti** (Festive achievement celebration animations)

### Backend
* **Node.js** (ES Modules)
* **Express.js** (REST API)
* **MongoDB & Mongoose** (With automated embedded In-Memory database fallback if local daemon is offline)
* **JSON Web Tokens (JWT)** & **bcryptjs** (Encrypted authentication)
* **Socket.IO Server** (Bi-directional real-time alert broadcasting)
* **Multer** (File upload middleware with static public serving)
* **Helmet**, **CORS**, and **Express Rate Limiting** (Production security)

---

## ⚡ Quick Start & Installation

### Prerequisites
* **Node.js** (v18 or v20+)
* **npm** (v9+)

### 1. Clone & Navigate to Project
```bash
cd CampusNumberOne
```

### 2. Install Dependencies
Install dependencies for both server and client:
```bash
# Install server packages
cd server
npm install

# Install client packages
cd ../client
npm install
```

### 3. Start Development Servers
From the root directory:
```bash
npm run dev
```
Or start server and client in separate terminals:
```bash
# Terminal 1: Start Backend API (Port 5000)
cd server
npm run dev

# Terminal 2: Start Frontend Vite App (Port 5173)
cd client
npm run dev
```

* **Frontend App**: [http://localhost:5173](http://localhost:5173)
* **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
* **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔑 Pre-Seeded Demo Accounts (1-Click Login)

The application includes an **Interactive Demo Switcher Banner** at the top of the app for 1-click exploration. You can also sign in manually with these credentials:

| Role | Name | Email | Password |
| :--- | :--- | :--- | :--- |
| **🎓 Student** | Alex Rivera | `student@campus.edu` | `password123` |
| **👩‍🏫 Faculty** | Prof. Sarah Jenkins | `faculty@campus.edu` | `password123` |
| **🛡️ Admin** | Dr. Richard Henderson | `admin@campus.edu` | `password123` |

---

## ⚙️ Environment Variables

### `server/.env`
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/campus_number_one
JWT_SECRET=campus_number_one_super_secret_jwt_key_2026_modern
CLIENT_URL=http://localhost:5173
```

### `client/.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

> **Note on MongoDB**: If a local MongoDB instance is running, CampusNumberOne connects to `MONGO_URI`. If no MongoDB daemon is detected, it automatically starts an in-memory embedded MongoDB instance (`mongodb-memory-server`) and seeds all realistic data automatically, ensuring zero setup friction!

---

## 📡 REST API Endpoints Overview

### Authentication
* `POST /api/auth/register` - Create student/faculty account
* `POST /api/auth/login` - Authenticate & obtain JWT
* `GET  /api/auth/me` - Get current user profile (Private)
* `PUT  /api/auth/profile` - Update bio, skills, socials, and details (Private)

### Events
* `GET    /api/events` - Get events with category & search filter
* `GET    /api/events/:id` - Get event details and participants
* `POST   /api/events` - Create event (Faculty/Admin)
* `PUT    /api/events/:id` - Update event (Faculty/Admin)
* `DELETE /api/events/:id` - Delete event (Faculty/Admin)
* `POST   /api/events/:id/register` - Register for event (Student)
* `POST   /api/events/:id/cancel` - Cancel registration (Student)
* `GET    /api/events/my-registrations` - List registered events with tickets (Private)

### Clubs
* `GET    /api/clubs` - List all campus clubs
* `GET    /api/clubs/:id` - Get club details, gallery, and members
* `POST   /api/clubs` - Charter new club (Admin/Faculty)
* `POST   /api/clubs/:id/join` - Join club (Student)
* `POST   /api/clubs/:id/leave` - Leave club (Student)
* `GET    /api/clubs/my-clubs` - List user's joined clubs

### Announcements
* `GET    /api/announcements` - List announcements with priority & pinned sorting
* `POST   /api/announcements` - Broadcast announcement (Faculty/Admin)
* `PUT    /api/announcements/:id` - Edit announcement (Faculty/Admin)
* `DELETE /api/announcements/:id` - Remove announcement (Faculty/Admin)

### Community Feed
* `GET    /api/posts` - Get community feed
* `POST   /api/posts` - Create post with media attachments & tags
* `DELETE /api/posts/:id` - Delete own post or admin moderate
* `POST   /api/posts/:id/like` - Toggle like with live count
* `GET    /api/posts/:id/comments` - Get post comments
* `POST   /api/posts/:id/comment` - Add comment
* `POST   /api/posts/:id/report` - Report post to admin queue

### Academics
* `GET    /api/academics/materials` - Filter lecture notes & manuals
* `POST   /api/academics/materials` - Upload course document (Faculty/Admin)
* `GET    /api/academics/assignments` - Get course assignments
* `POST   /api/academics/assignments` - Create assignment (Faculty/Admin)
* `POST   /api/academics/assignments/:id/submit` - Turn in assignment (Student)
* `POST   /api/academics/submissions/:id/grade` - Grade submission (Faculty/Admin)
* `GET    /api/academics/overview` - Get attendance breakdown & marks

### Achievements
* `GET    /api/achievements` - Get student portfolio collection
* `POST   /api/achievements` - Add achievement entry (Student)
* `POST   /api/achievements/:id/like` - Cheer student achievement

### Administration & Moderation
* `GET    /api/admin/stats` - Platform KPIs & summary counts
* `GET    /api/admin/analytics` - Trend metrics & distribution charts
* `GET    /api/admin/reports` - Moderation queue of flagged posts
* `PUT    /api/admin/reports/:id/resolve` - Resolve report or delete flagged content
* `GET    /api/users` - Search & filter campus user directory
* `PUT    /api/users/:id/status` - Toggle user active/suspended status

---

## 🎨 UI & Design Identity

* **Theme**: Deep Navy (`#0B132B`, `#1C2541`), Slate (`#F8FAFC`), Electric Blue (`#2563EB`), and Cyan (`#06B6D4`)
* **Typography**: Plus Jakarta Sans
* **Aesthetic**: Premium SaaS Dashboard + Connected Social Campus
* **Responsiveness**: 100% Mobile, Tablet, and Desktop responsive

---

## 📄 License
MIT License. Built for connected campus excellence.
