// MeetingRoom.js
import React, { useEffect, useRef } from 'react';

export default function MeetingRoom({ meeting, displayName, onLeave }) {
  const parentRef = useRef(null);
  const apiRef = useRef(null);

  useEffect(() => {
    if (!window.JitsiMeetExternalAPI) {
      console.error('Jitsi API not found on window');
      return;
    }

    const domain = 'meet.jit.si';
    const options = {
      roomName: meeting.roomName,
      parentNode: parentRef.current,
      width: '100%',
      height: '100%',
      configOverwrite: { disableDeepLinking: true, startWithAudioMuted: false, startWithVideoMuted: false },
      interfaceConfigOverwrite: {
        // minimal UI options can be customized here
      },
      userInfo: { displayName: displayName || meeting.hostName }
    };

    try {
      apiRef.current = new window.JitsiMeetExternalAPI(domain, options);

      // Set password automatically if meeting has one (our backend doesn't create password by default)
      // Example: if meeting.password exists:
      if (meeting.password) {
        apiRef.current.addEventListener('videoConferenceJoined', () => {
          try { apiRef.current.executeCommand('password', meeting.password); } catch (e) {}
        });
      }

      apiRef.current.addEventListener('readyToClose', () => {
        if (onLeave) onLeave();
      });
    } catch (err) {
      console.error('Jitsi init failed', err);
    }

    return () => {
      try { apiRef.current && apiRef.current.dispose(); } catch (e) {}
    };
  }, [meeting, displayName, onLeave]);

  return (
    <div className="card jitsi-wrapper" style={{padding:0}}>
      <div ref={parentRef} style={{width:'100%', height:'100%'}} />
      <div style={{position:'absolute', top:12, right:12}}>
        <button className="btn ghost" onClick={() => { if (apiRef.current) apiRef.current.executeCommand('hangup'); if (onLeave) onLeave(); }}>
          Leave
        </button>
      </div>
    </div>
  );
}
