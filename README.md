# TalentHub

A full-featured MERN (MongoDB, Express, React, Node.js) job platform for job seekers, employers, and admins. Built with modern best practices, file uploads, company approval, and robust authentication.

## Features

- User registration, login, and JWT authentication
- Company owner registration with document upload (Cloudinary)
- Admin dashboard for company approval/rejection
- Company/job management for company owners
- Job search and filter (by keyword, type, location)
- Job application with resume upload, education, and gender
- Application management (withdraw, status updates)
- Responsive, modern UI (React + Tailwind)
- Email notifications for verification, password reset, and company approval

## Live Demo

[https://talenthub-ust6.onrender.com/](https://talenthub-ust6.onrender.com/)

## Project Structure

```
/ (root)
  /backend      # Express API, MongoDB, Cloudinary, authentication
  /frontend     # React app, TypeScript, Tailwind CSS
```

## Getting Started (Local Development)

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Atlas or local MongoDB
- Cloudinary account (for file uploads)

### 1. Clone the repository
```
git clone https://github.com/temesgen-abebayehu/mern-talenthub.git
cd mern-talenthub
```

### 2. Setup Environment Variables

#### Backend (`backend/.env`):
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_pass
FROM_EMAIL=your_from_email
```

#### Frontend (`frontend/.env`):
```
# Usually not needed if using relative API URLs
# REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Install Dependencies

#### Backend
```
cd backend
npm install
```

#### Frontend
```
cd ../frontend
npm install
```

### 4. Run Locally

#### Backend
```
cd backend
npm run dev
```

#### Frontend
```
cd ../frontend
npm start
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:5000/api](http://localhost:5000/api)

## Deployment (Render, All-in-One)

1. Push all code to GitHub (both `backend/` and `frontend/` in one repo)
2. In `backend/server.js`, make sure you serve the React build for non-API routes (see code in repo)
3. On Render:
   - New Web Service
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Add all backend environment variables
4. Your app will be live at the Render URL (serving both frontend and backend)

## API Endpoints (Examples)

- `POST /api/auth/register` — Register user/company owner
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Get current user
- `POST /api/companies` — Register company (with document upload)
- `GET /api/jobs` — List/search jobs
- `POST /api/applications` — Apply for job (with resume upload)
- `DELETE /api/applications/:id` — Withdraw application

## Technologies
- React, TypeScript, Tailwind CSS
- Express, Node.js, MongoDB, Mongoose
- Cloudinary (file uploads)
- JWT Auth, bcrypt
- Nodemailer (email)

## License

MIT
