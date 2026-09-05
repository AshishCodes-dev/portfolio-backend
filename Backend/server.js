const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const connectDB = require('./Config/db');

const app = express();

// =====================
// MIDDLEWARE
// =====================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (React build if available, otherwise legacy Fontend)
const fs = require('fs');
const reactDistPath = path.join(__dirname, '../frontend/dist');
const legacyPath = path.join(__dirname, '../Fontend');

if (fs.existsSync(reactDistPath)) {
  app.use(express.static(reactDistPath));
} else {
  app.use(express.static(legacyPath));
}

// =====================
// DATABASE CONNECTION
// =====================
connectDB();

// =====================
// API ROUTES
// =====================
const contactRoutes = require('./Router/contact'); // Router/contact.js ko load kar raha hai
const projectRoutes = require('./Router/projects');

app.use('/api/contact', contactRoutes);
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
// SERVE FRONTEND - All other routes
// =====================
app.use((req, res) => {
  if (fs.existsSync(path.join(reactDistPath, 'index.html'))) {
    res.sendFile(path.join(reactDistPath, 'index.html'));
  } else {
    res.sendFile(path.join(legacyPath, 'index.html'));
  }
});

// =====================
// SERVER START
// =====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🌐 Website: http://localhost:${PORT}`);
  console.log(`🔌 API Test: http://localhost:${PORT}/api/test`);
});