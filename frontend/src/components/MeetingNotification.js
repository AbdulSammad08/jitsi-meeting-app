// MeetingNotification.js
import React from 'react';

export default function MeetingNotification({ meeting, onStart, onClose }) {
  const joinUrl = `https://meet.jit.si/${meeting.roomName}`;

  return (
    <div className="notification-modal card">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 8}}>
        <div>
          <div style={{fontWeight:700}}>It's time: {meeting.title}</div>
          <div className="small">Host: {meeting.hostName} • {meeting.date} {meeting.time}</div>
        </div>
        <div>
          <button className="btn ghost" onClick={onClose} style={{borderRadius:8}}>×</button>
        </div>
      </div>

      <div style={{display:'flex', gap:8}}>
        <button className="btn" onClick={() => onStart(meeting)}>Join in App</button>
        <button className="btn ghost" onClick={() => window.open(joinUrl, '_blank')}>Open in New Tab</button>
        <button className="btn ghost" onClick={() => { navigator.clipboard.writeText(joinUrl); alert('Link copied'); }}>Copy Link</button>
      </div>
    </div>
  );
}
