// frontend/src/api.js
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

export async function createMeeting(payload) {
  const res = await fetch(`${API_BASE}/api/meetings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function getMeetings() {
  const res = await fetch(`${API_BASE}/api/meetings`);
  return res.json();
}
