\# 📚 StudyMate – Student Study \& Task Management System



StudyMate is a full-stack web application designed to help students organize their academic activities, manage study tasks, track progress, and manage study resources in one place.



\## 🌐 Live Demo



\*\*Live Website:\*\* https://studymate-frontend-rgh9.onrender.com/



\## 📂 Repositories



\- \*\*Frontend:\*\* https://github.com/sezanmathakiya/studymate-frontend

\- \*\*Backend:\*\* https://github.com/sezanmathakiya/studymate-backend



\## ✨ Features



\- User signup and login

\- Student dashboard

\- Subject management

\- Study task management

\- Study progress tracking

\- Study file uploads

\- Email reminders



\## 🛠️ Tech Stack



\### Frontend

\- React

\- Vite

\- Tailwind CSS

\- React Router DOM

\- React Hook Form



\### Backend

\- Node.js

\- Express.js

\- MongoDB Atlas

\- Mongoose

\- JWT authentication

\- bcryptjs

\- Multer

\- Cloudinary



\### Deployment and Tools

\- Git and GitHub

\- Render

\- Google Search Console



\## 🏗️ Application Architecture



```text

Student

&#x20;  |

&#x20;  v

React + Vite Frontend

&#x20;  |

&#x20;  v

Node.js + Express.js API

&#x20;  |

&#x20;  +------> MongoDB Atlas

&#x20;  |

&#x20;  +------> Cloudinary

&#x20;  |

&#x20;  +------> Email Reminder Service

```



\## 🚀 Run Locally



\### Prerequisites

\- Node.js

\- npm

\- Git



\### 1. Clone the repository



```bash

git clone https://github.com/sezanmathakiya/studymate-frontend.git

```



\### 2. Open the project folder



```bash

cd studymate-frontend

```



\### 3. Install dependencies



```bash

npm install

```



\### 4. Start the development server



```bash

npm run dev

```



Open the local URL shown in the terminal.



\### 5. Create a production build



```bash

npm run build

```



The production build is generated in the `dist` directory.



\## ☁️ Deployment



The frontend is deployed on Render as a Static Site.



\- Build command: `npm run build`

\- Publish directory: `dist`



The backend is hosted separately and communicates with the frontend through API requests.



\## 🔐 Security



\- Do not commit `.env` files or private credentials.

\- Store sensitive secrets on the backend.

\- Validate incoming API requests.

\- Protect private routes and user data.

\- Configure CORS appropriately.



\## 🎯 Project Objective



StudyMate demonstrates practical full-stack development, including frontend design, backend API integration, database operations, authentication, file uploads, and cloud deployment.



\## 👨‍💻 Developer



\*\*Sezan Mathakiya\*\*



MCA Student | Aspiring Backend Developer



GitHub: https://github.com/sezanmathakiya



\---



\*StudyMate – Organize your studies. Manage your tasks. Track your progress.\*

