// Header.js
import React from 'react';

export default function Header({ onToggleDark, isDark }) {
  return (
    <div className="header">
      <div className="brand">
        <div style={{fontSize: '1.6rem'}}>📹</div>
        <div>
          <h1>Jitsi Scheduler</h1>
          <div className="small">Schedule meetings, get notified, start in-app</div>
        </div>
      </div>

      <div className="controls">
        <button className="btn ghost" onClick={() => navigator.clipboard.writeText(window.location.href)}>
          Share App
        </button>
        <button
          className="btn"
          onClick={() => {
            onToggleDark(!isDark);
          }}
        >
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </div>
  );
}
