const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./Config/db');

const app = express();

// =====================
// MIDDLEWARE
// =====================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================
// DATABASE CONNECTION
// =====================
connectDB();

// =====================
// ROUTES
// =====================
const contactRoutes = require('./Router/contact');
const projectRoutes = require('./Router/projects');

// Contact routes
app.use('/api/contact', contactRoutes);

// Project routes
app.use('/api/projects', projectRoutes);

// =====================
// TEST ROUTE
// =====================
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend working! ✅',
    status: 'Server is running'
  });
});

// =====================
// 404 HANDLER
// =====================
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route नहीं मिला',
    message: 'यह endpoint exist नहीं करता'
  });
});

// =====================
// SERVER START
// =====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Test करो: http://localhost:${PORT}/api/test`);
});