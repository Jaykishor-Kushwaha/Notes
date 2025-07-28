

📝 Notes App
A full-stack Notes app with OTP and Google login authentication.

🔗 Live Demo
Frontend: https://notes-rust-two.vercel.app/signin

Backend: https://notes-inaj.onrender.com

🧑‍💻 Tech Stack
Layer	Technology
Frontend	ReactJS (TypeScript)
Backend	Node.js (Express, TypeScript)
Database	MongoDB
Auth Methods	Google OAuth, Email OTP
Version Ctrl	Git
Deployment	Vercel (Frontend), Render (Backend)

✨ Features
🌐 Google Sign-In (OAuth via Passport.js)

🔐 OTP-based Authentication (email OTP)

🧾 Notes creation and management (extendable)

🚀 Fully deployed frontend and backend

🗂️ Project Structure
bash
Copy
Edit
/
├── backend/
│   ├── src/
│   └── .env
├── frontend/
│   ├── src/
│   └── .env
└── README.md
🔐 Environment Variables
🖥️ Backend .env (in /backend/)

env

PORT=5000
MONGO_URI=your_mongo_connection_uri
JWT_SECRET=your_jwt_secret_key

EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://notes-inaj.onrender.com/auth/google/callback

CLIENT_URL=https://notes-rust-two.vercel.app
💻 Frontend .env (in /frontend/)

https://notes-inaj.onrender.com
📦 Installation
Backend Setup
bash
Copy
Edit
cd backend
npm install
To run locally:

bash
Copy
Edit
npm run dev
Frontend Setup
bash
Copy
Edit
cd frontend
npm install
To run locally:

bash
Copy
Edit
npm start
☁️ Deployment Steps
🚀 Backend on Render
Go to https://dashboard.render.com

Click "New Web Service"

Connect to your GitHub repository

Select Root Directory: backend

Set:

Build Command: npm install

Start Command: npm run dev

Add environment variables from .env

Deploy!

🌐 Frontend on Vercel
Go to https://vercel.com

Click "Add New Project"

Select your GitHub repo and choose the frontend folder

Set:

Environment Variable:
https://notes-inaj.onrender.com

Click Deploy

🔒 Authentication Flow
🔘 Google Sign-In: Authenticates via OAuth2.0 and redirects back to frontend

✉️ Send OTP: Sends OTP to email (via nodemailer)

✅ Verify OTP: On success, logs in the user with a JWT

## 🖼️ Sign-Up Page Preview

![Sign-Up Page](./assets/signup-preview.png)




