// MeetingForm.js
import React, { useState } from 'react';
import { createMeeting } from '../api';

export default function MeetingForm({ onScheduled }) {
  const [form, setForm] = useState({
    title: '',
    hostName: '',
    date: '',
    time: '',
    duration: 60,
    maxParticipants: 10,
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!form.title || !form.hostName || !form.date || !form.time) {
      setErr('Title, host name, date and time are required');
      return;
    }
    try {
      setLoading(true);
      const res = await createMeeting(form);
      if (!res.success) throw new Error(res.error || 'Failed to schedule');
      onScheduled(res);
      setForm({
        title: '',
        hostName: '',
        date: '',
        time: '',
        duration: 60,
        maxParticipants: 10,
        notes: ''
      });
    } catch (e) {
      setErr(e.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card form">
      <h3>Schedule a Meeting</h3>
      <form onSubmit={submit}>
        <label className="small">Meeting Title</label>
        <input name="title" value={form.title} onChange={change} placeholder="e.g., Project Sync" />

        <label className="small">Host Name</label>
        <input name="hostName" value={form.hostName} onChange={change} placeholder="Your name" />

        <label className="small">Date</label>
        <input type="date" name="date" value={form.date} onChange={change} />

        <label className="small">Start Time</label>
        <input type="time" name="time" value={form.time} onChange={change} />

        <label className="small">Duration (minutes)</label>
        <input type="number" min="10" name="duration" value={form.duration} onChange={change} />

        <label className="small">Max Participants</label>
        <input type="number" min="1" name="maxParticipants" value={form.maxParticipants} onChange={change} />

        <label className="small">Notes (optional)</label>
        <textarea name="notes" value={form.notes} onChange={change} placeholder="Agenda or notes" />

        {err && <div style={{ color: 'crimson', marginBottom: 8 }}>{err}</div>}

        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Scheduling...' : 'Schedule Meeting'}
        </button>
      </form>
    </div>
  );
}
