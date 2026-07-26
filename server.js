require('dotenv').config();

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);




require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serves your index.html, style.css, script.js
app.enable('trust proxy');    // Detects real IPs when hosted online

// 1. Connect to MongoDB
// Replace YOUR_USERNAME and YOUR_PASSWORD with your real MongoDB credentials!
mongoose.connect(process.env.MONGO_URL, {
  serverSelectionTimeoutMS: 5000
})
  .then(() => console.log('✅ Connected to MongoDB successfully!'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// 2. Schema for storing IP address
const ipSchema = new mongoose.Schema({
  ipAddress: String,
  userDevice: String,
  clickedAt: { type: Date, default: Date.now }
});

const IpLog = mongoose.model('IpLog', ipSchema);

// 3. API Endpoint to capture IP
app.post('/api/track-ip', async (req, res) => {
  try {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const newLog = new IpLog({
      ipAddress: clientIp,
      userDevice: userAgent
    });

    await newLog.save();
    console.log(`📌 Recorded IP: ${clientIp}`);

    res.status(200).json({ success: true, message: 'IP recorded' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));