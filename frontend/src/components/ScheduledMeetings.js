// ScheduledMeetings.js
import React, { useEffect, useState } from 'react';
import { getMeetings } from '../api';
import MeetingNotification from './MeetingNotification';

export default function ScheduledMeetings({ onStartRoom }) {
  const [meetings, setMeetings] = useState([]);
  const [upcomingNotif, setUpcomingNotif] = useState(null);

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  async function load() {
    const data = await getMeetings();
    setMeetings(data || []);
  }

  // Check every 15s for meetings to notify (also run once immediately)
  useEffect(() => {
    const checkNow = () => {
      const now = new Date();
      meetings.forEach(m => {
        const meetingTime = new Date(`${m.date}T${m.time}:00`);
        // Trigger when minute matches now and within delay window
        const diffMs = meetingTime - now;
        // notify when meeting is within [-30s, +59s] to avoid duplicates: slight tolerance
        if (diffMs <= 60000 && diffMs >= -30000) {
          setUpcomingNotif(m);
        }
      });
    };
    checkNow();
    const t = setInterval(checkNow, 15000);
    return () => clearInterval(t);
  }, [meetings]);

  return (
    <div className="card">
      <h3>Scheduled Meetings</h3>
      <div className="meet-list">
        {meetings.length === 0 && <div className="small">No meetings scheduled</div>}
        {meetings.map(m => (
          <div key={m.id} className="meet-item">
            <div>
              <div style={{fontWeight:600}}>{m.title}</div>
              <div className="small">{m.date} • {m.time} • {m.hostName}</div>
            </div>
            <div style={{textAlign:'right'}}>
              <div className="small">Room: {m.roomName.slice(0,16)}...</div>
              <button className="btn ghost" style={{marginTop:8}} onClick={() => onStartRoom(m)}>
                Start / Join
              </button>
            </div>
          </div>
        ))}
      </div>

      {upcomingNotif && (
        <MeetingNotification
          meeting={upcomingNotif}
          onStart={() => onStartRoom(upcomingNotif)}
          onClose={() => setUpcomingNotif(null)}
        />
      )}
    </div>
  );
}
