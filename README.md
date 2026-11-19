# Placement Skill Monitoring Management System

A full-stack **MERN (MongoDB, Express.js, React.js, Node.js)** web application engineered to monitor, evaluate, and manage college students' technical proficiencies, aptitude scores, communication skills, and campus placement readiness.

---

## 📌 Project Overview

The **Placement Skill Monitoring Management System** provides college placement cells, department coordinators, and training officers with a centralized dashboard to track student competencies in real time. It calculates key placement metrics directly from database records, evaluates aptitude benchmarks, facilitates skill profiling, and supports complete CRUD workflows.

- **Frontend**: React 18 with Vite, React Router DOM v6, Axios, Lucide Icons, and responsive CSS3.
- **Backend**: Node.js & Express.js REST API with Mongoose ORM, CORS configuration, and validation layers.
- **Database**: MongoDB Atlas / local MongoDB (`placementDB`, collection: `studentskills`).

---

## ✨ Features

- **Dynamic Placement Dashboard**:
  - Live metric cards: Total Registered Students, Placement Ready (Green), In Progress (Orange), and Not Ready (Red).
  - Calculated dynamically from actual MongoDB records via the backend REST API.
  - Aptitude Benchmark progress bar and score analysis.
  - Popular Technical Skills distribution breakdown.
  - Department-wise student enrollment tracking.
  - Quick list of recently added student profiles.
- **Student Skill Profile Registration**:
  - Structured form with 9 key fields:
    1. Student Name (min 2 characters)
    2. Register Number (Unique alphanumeric, auto-uppercased)
    3. Department (Dropdown)
    4. Year of Study (1st, 2nd, 3rd, 4th Year)
    5. Email Address (Validated email format)
    6. Technical Skills (Interactive multi-select chips: Java, Python, React, Node.js, SQL + Custom skill tag creator)
    7. Aptitude Score (0–100 range slider and validated number input)
    8. Communication Skills (Beginner, Intermediate, Advanced)
    9. Placement Readiness (Ready, In Progress, Not Ready)
  - Full client-side & server-side validation.
  - Duplicate register number prevention (returns HTTP 409 Conflict).
  - Submit & Reset controls with feedback banners.
- **Responsive Student Skill List**:
  - Tabular view and Card Grid view toggle.
  - Real-time search by Student Name or Register Number.
  - Multi-criteria filtering by Department and Placement Readiness.
  - Detail inspection modal (`View` button).
  - Edit navigation (`Edit` button pre-filling the record).
  - Safe deletion with two-step confirmation modal (`Delete` button).
  - Live MongoDB loading indicator, error handling, and empty-state fallbacks.
- **Record Modification (Edit)**:
  - Fetches existing student record by MongoDB ObjectId.
  - Pre-fills all inputs and skill chips.
  - Saves updates via Axios `PUT /api/students/:id` and navigates back to list.
- **Health Check & Diagnostic Endpoint**:
  - `GET /api/health` monitoring server uptime and status.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | React.js (v18.3) with Vite | Lightning-fast SPA build tool & renderer |
| **Routing** | React Router DOM (v6.28) | Declarative client-side routing |
| **HTTP Client** | Axios (v1.7) | Promise-based API communication with interceptors |
| **Icons** | Lucide React | Modern, lightweight UI icons |
| **Styling** | CSS3 | Responsive design, CSS variables, navy & light-blue theme |
| **Backend Runtime** | Node.js (v20+ / v24) | JavaScript runtime |
| **Web Framework** | Express.js (v4.21) | RESTful API routing, middleware, error handling |
| **Database ORM** | Mongoose (v8.9) | Schema validation, unique index management |
| **Database** | MongoDB Atlas / Local | Database: `placementDB`, Collection: `studentskills` |

---

## 📁 Project Folder Structure

```
placement-skill-monitoring/
│
├── frontend/                              # Frontend React + Vite application
│   ├── public/                            # Static assets and favicon
│   ├── src/
│   │   ├── components/                    # Reusable React components
│   │   │   ├── Navbar.jsx                 # Dark navy responsive top navigation bar
│   │   │   └── StudentCard.jsx            # Reusable student skill card (badges, aptitude, actions)
│   │   ├── pages/                         # Application routed pages
│   │   │   ├── Home.jsx                   # Placement dashboard with live stats & metrics
│   │   │   ├── AddStudent.jsx             # Student skill registration form with validation
│   │   │   ├── StudentList.jsx            # Student skill records table, search, filters & modals
│   │   │   └── EditStudent.jsx            # Pre-filled edit form with PUT API integration
│   │   ├── services/
│   │   │   └── api.js                     # Reusable Axios instance and REST API methods
│   │   ├── App.jsx                        # Root React component configuring routes
│   │   ├── main.jsx                       # React entry point with BrowserRouter wrapper
│   │   └── index.css                      # Unified modern CSS design system
│   ├── index.html                         # HTML template
│   ├── vite.config.js                     # Vite build & dev server configuration
│   ├── vercel.json                        # Vercel SPA routing rewrite configuration
│   ├── .env.example                       # Frontend environment template
│   ├── .env                               # Local frontend environment variables
│   └── package.json                       # Frontend dependencies and build scripts
│
├── backend/                               # Backend Node.js + Express REST API
│   ├── config/
│   │   └── db.js                          # Mongoose connection to MongoDB 'placementDB'
│   ├── models/
│   │   └── StudentSkill.js                # Schema definition for 'studentskills' collection
│   ├── routes/
│   │   └── studentRoutes.js               # Express router for CRUD endpoints & error handling
│   ├── seed.js                            # Seed script with realistic student profiles
│   ├── test_api.js                        # Automated CRUD verification test suite
│   ├── .env.example                       # Backend environment template
│   ├── .env                               # Local backend environment variables
│   ├── package.json                       # Backend dependencies and run scripts
│   └── server.js                          # Express app entry point, CORS, routes & health check
│
├── .gitignore                             # Git exclusion for node_modules, .env, dist, build
└── README.md                              # Complete system documentation
```

### Purpose of Key Folders & Important Files

1. **`frontend/src/services/api.js`**: Creates a central Axios instance referencing `VITE_API_URL`. Exports clean async helper functions (`getStudents`, `createStudent`, `updateStudent`, `deleteStudent`, `checkBackendHealth`) so components do not make raw HTTP calls.
2. **`frontend/src/components/Navbar.jsx`**: Provides accessible navigation using `NavLink`, displays active route indicators, includes a live backend connection status pill, and supports a responsive mobile menu.
3. **`frontend/src/components/StudentCard.jsx`**: Modular card rendering a student's avatar, register number, department, year, email, skill tags, colored aptitude score bar, and placement status pill.
4. **`frontend/src/pages/Home.jsx`**: Main analytics hub. Queries MongoDB via backend API and calculates total count, readiness percentages, aptitude averages, and department tallies.
5. **`frontend/src/pages/AddStudent.jsx`**: Validates user inputs, manages custom technical skill chips, and executes `POST /api/students` with clear success/error banners.
6. **`frontend/src/pages/StudentList.jsx`**: Responsive data table supporting search, filters, table-to-card view switching, profile inspection dialog, and delete confirmation modal.
7. **`frontend/src/pages/EditStudent.jsx`**: Retrieves student by ID via `GET /api/students/:id`, populates fields, applies validation, updates via `PUT /api/students/:id`, and redirects.
8. **`backend/config/db.js`**: Manages the MongoDB database connection, explicitly targeting `placementDB`, and logs connection events.
9. **`backend/models/StudentSkill.js`**: Defines the Mongoose schema for the `studentskills` collection with strict field requirements, unique constraints, and timestamps.
10. **`backend/routes/studentRoutes.js`**: Implements Express route handlers for `GET /`, `GET /:id`, `POST /`, `PUT /:id`, and `DELETE /:id` with proper HTTP status codes (200, 201, 400, 404, 409, 500).
11. **`backend/server.js`**: Configures Express, CORS, JSON parsing middleware, the `/api/health` diagnostic endpoint, mounts student routes, and provides global error middleware.

---

## 📡 Backend REST API Endpoints

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description | Request Body | Success Status |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/health` | Health check & uptime diagnostic | None | `200 OK` |
| `GET` | `/students` | Get all student records (supports `?search=`, `?department=`, `?readiness=`) | None | `200 OK` |
| `GET` | `/students/:id` | Get single student record by MongoDB ID | None | `200 OK` |
| `POST` | `/students` | Register a new student skill profile | JSON (Student details) | `201 Created` |
| `PUT` | `/students/:id` | Update an existing student record | JSON (Fields to update) | `200 OK` |
| `DELETE` | `/students/:id` | Delete student record permanently | None | `200 OK` |

### Error Handling & HTTP Status Codes:
- `200 OK`: Request succeeded.
- `201 Created`: Student record saved successfully.
- `400 Bad Request`: Missing required fields, invalid score (not 0–100), or invalid MongoDB ID format.
- `404 Not Found`: Student ID does not exist in the database.
- `409 Conflict`: Register Number is already registered (unique constraint violation).
- `500 Internal Server Error`: Unhandled server exception.

---

## ⚙️ Environment Variables

### 1. Backend (`backend/.env`)

```env
PORT=5000
# For Local MongoDB:
MONGODB_URI=mongodb://127.0.0.1:27017/placementDB

# For MongoDB Atlas (replace <username> and <password>):
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/placementDB?retryWrites=true&w=majority

FRONTEND_URL=http://localhost:5173
```

### 2. Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

> **Security Note**: Never commit `.env` files to GitHub. Only commit `.env.example` templates.

---

## 🚀 Running Instructions (Local Setup)

### Prerequisites:
- **Node.js** (v18.x or v20+ / v24+)
- **npm** (v9+ or v10+)
- **MongoDB** (Local MongoDB Community Server running on `27017` **OR** a free [MongoDB Atlas](https://www.mongodb.com/atlas) Cluster URI).

### Step 1: Backend Setup

1. Open a terminal and navigate to `backend`:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment:
   - Ensure `backend/.env` exists with your MongoDB URI.
4. *(Optional)* Seed initial student records:
   ```bash
   npm run seed
   ```
5. *(Optional)* Run automated CRUD verification test suite:
   ```bash
   npm test
   ```
6. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server will start on `http://localhost:5000` with hot-reloading.*

---

### Step 2: Frontend Setup

1. Open a second terminal and navigate to `frontend`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## ☁️ Deployment Instructions

### A. MongoDB Atlas Database Setup
1. Create a free account at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a new Cluster (e.g., M0 Free Tier).
3. Under **Database Access**, create a database user (e.g., `placementAdmin`) and set a secure password.
4. Under **Network Access**, add IP Address `0.0.0.0/0` (Allow Access from Anywhere) to permit connections from Render/hosting services.
5. In your cluster dashboard, click **Connect** -> **Drivers** -> Copy the connection string.
6. Replace `<password>` with your password, and specify `/placementDB`:
   ```
   mongodb+srv://placementAdmin:YOUR_PASSWORD@cluster0.mongodb.net/placementDB?retryWrites=true&w=majority
   ```

---

### B. Backend Deployment on Render
1. Push your repository to **GitHub**.
2. Sign in to [Render.com](https://render.com) and click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Set the following configuration:
   - **Name**: `placement-skill-monitoring-api`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Under **Environment Variables**, add:
   - `PORT` = `5000`
   - `MONGODB_URI` = `mongodb+srv://.../placementDB?retryWrites=true&w=majority`
   - `FRONTEND_URL` = `https://your-frontend-domain.vercel.app`
6. Click **Deploy Web Service**.
7. Note down your Render API URL (e.g., `https://placement-skill-monitoring-api.onrender.com`).

---

### C. Frontend Deployment on Vercel
1. Sign in to [Vercel.com](https://vercel.com) and click **Add New** -> **Project**.
2. Select your GitHub repository.
3. Configure the Project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click edit and choose `frontend`.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Under **Environment Variables**, add:
   - `VITE_API_URL` = `https://placement-skill-monitoring-api.onrender.com/api`
5. Click **Deploy**.
6. The included `frontend/vercel.json` ensures client-side routes (`/students`, `/add-student`, `/edit-student/:id`) route directly to `index.html` without 404 errors.

---

## 🧪 Verification & Testing Checklist

- [x] **Database Connectivity**: Connected to MongoDB database `placementDB` and collection `studentskills`.
- [x] **Home Dashboard**: Live cards for Total Students, Placement Ready, In Progress, and Not Ready calculated directly from database records.
- [x] **Add Student Skills**: Interactive form with technical skill chips, range slider for aptitude score (0–100), duplicate register number prevention, and validation.
- [x] **Student Skill List**: Responsive table with search, department filtering, readiness filtering, detail modal view, and safe deletion.
- [x] **Edit Student**: Pre-fills student data, performs PUT update via Axios, and navigates back to list.
- [x] **Automated Tests**: Tested all CRUD operations via `test_api.js` (9/9 tests passed).
- [x] **CORS Configuration**: Configured with allowed origins and express JSON parsing.
- [x] **Security**: Environment variables isolated from version control; `.gitignore` configured.

---

## 📄 License
This project is open-source and created for educational and college placement monitoring purposes.
