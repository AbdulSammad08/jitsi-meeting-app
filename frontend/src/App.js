// App.js
import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import MeetingForm from './components/MeetingForm';
import ScheduledMeetings from './components/ScheduledMeetings';
import MeetingRoom from './components/MeetingRoom';
import { getMeetings } from './api';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    if (isDark) document.body.classList.add('dark'); else document.body.classList.remove('dark');
  }, [isDark]);

  useEffect(() => {
    refreshMeetings();
    const t = setInterval(refreshMeetings, 30000);
    return () => clearInterval(t);
  }, []);

  async function refreshMeetings() {
    const data = await getMeetings();
    setMeetings(data || []);
  }

  const handleScheduled = (res) => {
    refreshMeetings();
    alert('Meeting scheduled — share the link in scheduled list.');
  };

  const handleStartRoom = (meeting) => {
    setCurrentRoom(meeting);
  };

  return (
    <div className="app-container">
      <Header onToggleDark={setIsDark} isDark={isDark} />

      {!currentRoom ? (
        <div className="grid">
          <div>
            <MeetingForm onScheduled={handleScheduled} />
            <div style={{height:20}} />
            <div className="card">
              <h3>Upcoming (next 10)</h3>
              <ScheduledMeetings onStartRoom={handleStartRoom} />
            </div>
          </div>

          <div>
            <div className="card">
              <h3>Quick Actions</h3>
              <div style={{display:'flex', flexDirection:'column', gap:10}}>
                <button className="btn" onClick={() => alert('Place for future integrations (recording, analytics)')}>Integrations</button>
                <button className="btn ghost" onClick={() => alert('Export / Share feature coming soon')}>Export</button>
              </div>
            </div>
            <div style={{height:20}} />
            <div className="card">
              <h3>Tips</h3>
              <ul className="small">
                <li>Use unique meeting titles to auto-generate room names.</li>
                <li>Share links with participants — they can join in browser.</li>
                <li>Localhost is allowed for camera/mic in development.</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div style={{display:'flex', gap:10, marginBottom:12}}>
            <button className="btn ghost" onClick={() => setCurrentRoom(null)}>Back</button>
            <div style={{alignSelf:'center'}}><strong>{currentRoom.title}</strong> • {currentRoom.date} {currentRoom.time}</div>
          </div>

          <MeetingRoom
            meeting={currentRoom}
            displayName={currentRoom.hostName}
            onLeave={() => setCurrentRoom(null)}
          />
        </div>
      )}

    </div>
  );
}
