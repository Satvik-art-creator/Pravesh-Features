# Teacher Login Backend Features

This document logs all the features implemented in the Teacher Login Backend module.

## 1. Teacher Model (Mongoose Schema)
- Created `Teacher` schema with `name`, `email` (unique, lowercase), `password`, `tokenVersion` (default 0), and `createdAt`.

## 2. Admin Route — Create Teacher
- Implemented `POST /api/admin/create-teacher`.
- Protected by `x-admin-key` header checked against `process.env.ADMIN_SECRET_KEY`.
- Validates input using `express-validator` (name required, valid email, min password length 6).
- Hashes password using `bcrypt` (saltRounds: 12).
- Returns the created teacher object without the password field.

## 3. Teacher Login Route
- Implemented `POST /api/auth/login`.
- Looks up teacher by email and compares password using `bcrypt.compare`.
- Issues a JWT access token containing `teacherId`, `email`, and `tokenVersion`, expiring in 180 days.
- Returns a generic `401 Invalid credentials` error for any failure (wrong email or wrong password).

## 4. Rate Limiting
- Applied `express-rate-limit` middleware on the `/api/auth/login` route.
- Limited to 5 attempts per 15 minutes per IP.
- Returns a clear error message when rate limited.

## 5. Auth Middleware
- Created `middleware/auth.middleware.js`.
- Extracts JWT from `Authorization: Bearer <token>` header.
- Verifies the token using `process.env.JWT_SECRET`.
- Fetches the teacher and ensures `decoded.tokenVersion === teacher.tokenVersion`.
- Attaches `req.teacher = { id, email }` on success.
- Returns 401 on failure or session revocation.

## 6. Logout Route
- Implemented `POST /api/auth/logout`.
- Returns a stateless success response, instructing the client to clear the token.

## 7. Session Revocation Support
- Implemented `POST /api/admin/revoke-session/:teacherId`.
- Protected by `x-admin-key` header.
- Increments the teacher's `tokenVersion`, invalidating any existing JWTs for that teacher.

## 8. Production Security Middleware
- Added `helmet` for secure HTTP headers.
- Configured `cors` with `process.env.FRONTEND_URL` and `credentials: true`.
- Added `express-mongo-sanitize` to prevent NoSQL injection.
- Added `express.json({ limit: '10kb' })` to limit body size.
- Implemented centralized error-handling middleware (`middleware/errorHandler.js`).
- Integrated `morgan` for request logging.

## 9. Environment Variables
- Created `.env.example` file with required variables (`PORT`, `MONGO_URI`, `JWT_SECRET`, `ADMIN_SECRET_KEY`, `FRONTEND_URL`).

## 10. Folder Structure & Code Quality
- Followed the requested structured layout (models, routes, controllers, middleware, utils, server.js).
- Used `async/await` and centralized error handling (passing errors to `next()`).
- Consistent JSON responses: `{ success: true/false, message, data }`.
- Added JSDoc-style comments for controllers.
