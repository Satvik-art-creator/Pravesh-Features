const dotenv = require('dotenv');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');

const connectDB = require('./utils/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

connectDB();

const app = express();

// Trust proxy headers (X-Forwarded-For) so req.ip returns the real client IP
// when running behind nginx, a cloud load balancer, or similar reverse proxy.
// This is critical for the WiFi IP verification in the attendance module.
app.set('trust proxy', true);

// Serve uploaded files publicly — each file is accessible at /uploads/<storedName>
app.use('/uploads', express.static('uploads'));

app.use(helmet());

app.use(mongoSanitize());

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5174',
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '10kb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  // Simple format for production if winston is not fully configured yet
  app.use(morgan('combined'));
}

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/classroom', require('./routes/classroom.routes'));
app.use('/api/join', require('./routes/join.routes'));
app.use('/api/attendance', require('./routes/attendance.routes'));
app.use('/api/grades', require('./routes/grades.routes'));
app.use('/api/classroom', require('./routes/posts.routes'));
app.use('/api/public', require('./routes/publicPosts.routes'));

app.use(errorHandler);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
