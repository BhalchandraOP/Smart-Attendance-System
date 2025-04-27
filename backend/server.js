const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const redis = require('redis');
const WebSocket = require('ws');
const Student = require('./models/Student'); // Assuming this model exists

const app = express();
const port = 3000;

let redisClient = null;

// Graceful Redis setup
(async () => {
  try {
    redisClient = redis.createClient({
      socket: {
        reconnectStrategy: false
      }
    });

    redisClient.on('error', (err) => {
      console.warn('⚠️ Redis connection error. Falling back without cache:');
    });

    await redisClient.connect();
    console.log('✅ Redis connected');
  } catch (err) {
    console.warn('⚠️ Redis connection error. Falling back without cache:');
    console.error(err);
    redisClient = null;
  }
})();

// WebSocket Server Setup
const wss = new WebSocket.Server({ noServer: true });
wss.on('connection', (ws) => {
  console.log('🔌 WebSocket client connected');
  ws.on('message', (message) => {
    console.log('📩 WebSocket received:', message);
  });
});

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb+srv://workbhalchandra:ofnIu9nCXNXM8d3K@cluster0.zgwf3wg.mongodb.net/myDatabase?retryWrites=true&w=majority')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Root route
app.get('/', (req, res) => {
  res.send('Smart Attendance System Server');
});

// Add new student
app.post('/students', async (req, res) => {
  try {
    const { uid, name } = req.body;
    const student = new Student({ uid, name, attendanceCount: 0, status: 'Exited', entryTime: null });
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all students
app.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Manual update
app.put('/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const student = await Student.findByIdAndUpdate(
      id,
      { status, entryTime: new Date() },
      { new: true }
    );
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.status(200).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔄 Scan endpoint (fixed cache issue)
app.post('/scan', async (req, res) => {
  try {
    const { uid } = req.body;
    if (!uid) return res.status(400).json({ error: 'UID is required' });

    const student = await Student.findOne({ uid });
    if (!student) return res.status(404).json({ message: 'Access Denied. Student not found' });

    // Toggle logic for Entered / Exited
    if (student.status === 'Exited') {
      student.status = 'Entered';
      student.attendanceCount += 1;
      student.entryTime = new Date();
    } else {
      student.status = 'Exited';
      student.entryTime = null;
    }

    // Add scan history
    student.scanHistory.push({
      status: student.status,
      time: new Date()
    });

    // Save the updated student to the database
    await student.save();

    const responseData = {
      message: 'Scan processed successfully',
      uid: student.uid,
      name: student.name,
      status: student.status,
      attendanceCount: student.attendanceCount,
      entryTime: student.entryTime
    };

    // Cache only if Exited
    if (redisClient && student.status === 'Exited') {
      try {
        await redisClient.setEx(uid, 3600, JSON.stringify(responseData));
      } catch (err) {
        console.warn('⚠️ Redis cache error:', err.message);
      }
    }

    // Broadcast to all WebSocket clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        // Fetch the latest students list from DB
        Student.find().then(allStudents => {
          client.send(JSON.stringify({
            uid: student.uid,
            name: student.name,
            status: student.status,
            attendanceCount: student.attendanceCount,
            scanHistory: student.scanHistory,
            students: allStudents, // Send the entire students list to clients
          }));
        });
      }
    });

    return res.status(200).json(responseData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start HTTP server
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://0.0.0.0:${port} (accessible on LAN)`);
});

// WebSocket upgrade handling
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});
