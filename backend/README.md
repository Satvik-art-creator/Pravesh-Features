# Teacher Login Backend

This is the backend authentication module for the college platform. It is built using Node.js, Express, and MongoDB.

## Getting Started

### 1. Prerequisites
- Node.js (v14 or higher recommended)
- MongoDB (local or Atlas)

### 2. Installation
Navigate to the `backend` directory and install the dependencies:
```bash
cd backend
npm install
```

### 3. Environment Variables
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```
Update the following variables in your `.env` file as needed:
- `PORT`: Port for the server to run on (default 5000).
- `MONGO_URI`: Your MongoDB connection string (e.g., `mongodb://localhost:27017/college`).
- `JWT_SECRET`: Secret key for signing JWTs.
- `ADMIN_SECRET_KEY`: Static secret key used to protect admin routes (e.g., `x-admin-key`).
- `FRONTEND_URL`: URL of the frontend for CORS policy (default `http://localhost:3000`).

### 4. Running the Server
To run the server in development mode (with nodemon):
```bash
npm run dev
```

To run the server in production mode:
```bash
npm start
```

## Features
- Admin route to create teachers.
- Teacher login route with rate limiting (5 attempts per 15 minutes).
- JWT-based authentication with session revocation support.
- Production-ready security middleware (Helmet, CORS, Mongo Sanitize).
- Centralized error handling.

Check out `features.md` for a complete log of implemented features.
