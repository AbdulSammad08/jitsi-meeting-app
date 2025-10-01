// backend/server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_PATH = path.join(__dirname, 'meetings.json');

function readMeetings() {
  try {
    const raw = fs.readFileSync(DATA_PATH);
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function writeMeetings(list) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(list, null, 2));
}

// Create meeting
app.post('/api/meetings', (req, res) => {
  const { title, hostName, date, time, duration, maxParticipants, notes } = req.body;

  if (!title || !hostName || !date || !time) {
    return res.status(400).json({ error: 'Missing required fields: title, hostName, date, time' });
  }

  const id = uuidv4();
  // safe room name for Jitsi
  const safeTitle = String(title).trim().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-_]/g, '').toLowerCase();
  const roomName = `${safeTitle}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,6)}`;

  const meeting = {
    id,
    title,
    hostName,
    date,          // YYYY-MM-DD
    time,          // HH:MM (24h)
    duration: duration || 60,
    maxParticipants: maxParticipants || 10,
    notes: notes || '',
    roomName,
    createdAt: new Date().toISOString()
  };

  const meetings = readMeetings();
  meetings.push(meeting);
  writeMeetings(meetings);

  // joinUrl for sharing (external)
  const joinUrl = `https://meet.jit.si/${meeting.roomName}`;

  res.json({ success: true, meeting, joinUrl });
});

// Get all meetings
app.get('/api/meetings', (req, res) => {
  const meetings = readMeetings();
  // sort by date/time ascending
  meetings.sort((a, b) => {
    const ta = new Date(`${a.date}T${a.time}:00`);
    const tb = new Date(`${b.date}T${b.time}:00`);
    return ta - tb;
  });
  res.json(meetings);
});

// Get single meeting
app.get('/api/meetings/:id', (req, res) => {
  const meetings = readMeetings();
  const m = meetings.find(x => x.id === req.params.id);
  if (!m) return res.status(404).json({ error: 'Not found' });
  res.json(m);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));
