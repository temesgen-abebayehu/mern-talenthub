import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import fileUpload from 'express-fileupload';
import connectDB from './config/database.js';
import errorHandler from './middleware/errorHandler.js';

import authRoutes from './routes/auth.js';
import jobRoutes from './routes/jobs.js';
import applicationRoutes from './routes/applications.js';
import userRoutes from './routes/users.js';
import companyRoutes from './routes/companies.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));
app.use(morgan('dev'));

// API Routes

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/companies', companyRoutes);

// Health check
app.get('/', (req, res) => {
    res.send('TalentHub API is running');
});

// Serve React static files
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Only serve index.html for non-API routes
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
