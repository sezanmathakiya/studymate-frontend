# StudyMate — AI-Powered Student Study & Task Management System

StudyMate is a full-stack web application designed to help students organize their subjects, manage study tasks, track academic progress, and get AI-powered learning assistance in one place.

🌐 **Live Demo:** https://studymate-frontend-rgh9.onrender.com

## ✨ Features

- **User Authentication:** Secure signup and login using JWT authentication and bcrypt password hashing.
- **Subject Management:** Create, view, update, and delete subjects.
- **Task Management:** Organize tasks with priorities, due dates, and completion statuses.
- **Progress Tracking:** Monitor task completion, subject-wise progress, and recent study activity.
- **Study File Management:** Upload and manage study materials using Cloudinary.
- **AI Study Assistant:** Ask questions and get AI-generated explanations using Google Gemini.
- **Email Reminders:** Scheduled reminders to support study planning.
- **User Data Isolation:** Authenticated users can access their own subjects, tasks, and files.

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- React Router DOM
- React Hook Form
- JavaScript

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Google Gemini API
- Multer
- Cloudinary

### Tools & Deployment
- Visual Studio Code
- Git and GitHub
- Postman
- MongoDB Atlas
- Render

## 🏗️ Architecture

The frontend communicates with the Express.js REST API. The backend handles authentication, application logic, database operations, file management, and AI requests.

- **Frontend repository:** https://github.com/sezanmathakiya/studymate-frontend
- **Backend repository:** https://github.com/sezanmathakiya/studymate-backend
- **Frontend deployment:** https://studymate-frontend-rgh9.onrender.com
- **Backend deployment:** https://studymate-backend-1-izz3.onrender.com

## ⚙️ Local Setup

### Prerequisites
- Node.js and npm
- MongoDB database
- Git

### 1. Clone the repositories

Frontend:

```bash
git clone https://github.com/sezanmathakiya/studymate-frontend.git
cd studymate-frontend
npm install
```

Backend — open a separate terminal:

```bash
git clone https://github.com/sezanmathakiya/studymate-backend.git
cd studymate-backend
npm install
```

### 2. Configure environment variables

Create a `.env` file in the backend directory and configure the variables required by the backend, such as:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key
```

Configure any additional Cloudinary and email-related variables required by your backend code.

Never commit your `.env` file or expose API keys, database credentials, or JWT secrets publicly.

### 3. Configure the frontend

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3000
```

### 4. Run the application

Start the backend:

```bash
npm start
```

Start the frontend in its own terminal:

```bash
npm run dev
```

Open the local URL displayed by Vite in your browser.

## 🔐 Security

- JWT-based authentication for protected APIs.
- Password hashing using bcryptjs.
- User-specific database queries for subjects, tasks, and files.
- Request rate limiting and security headers.
- Environment variables for sensitive configuration.

Security testing performed so far includes unauthenticated API requests and checks that one account's subjects, tasks, and files are not displayed in another account. This is not a complete security audit.

## 🎯 Project Goal

The goal of StudyMate is to combine student productivity tools and AI-powered learning assistance in a single application, helping students organize their studies and manage their academic workload.

## 👨‍💻 Author

**Sezan Mathakiya**

MCA Student | Node.js / Backend Developer

GitHub: https://github.com/sezanmathakiya

---

*Built to make studying more organized, productive, and accessible.*
