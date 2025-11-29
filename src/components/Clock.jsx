import { useEffect, useState } from 'react';

function Clock({ title, timezone, onRemove }) {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  const local = new Date(utc + 3600000 * timezone);

  const hours = local.getHours();
  const minutes = local.getMinutes();
  const seconds = local.getSeconds();

  // Calculate rotations in degrees
  const hourDeg = ((hours % 12) + minutes / 60) * 30; // 30 degrees per hour + minutes/60 of an hour
  const minuteDeg = minutes * 6; // 6 degrees per minute
  const secondDeg = seconds * 6; // 6 degrees per second

  const timeString = local.toLocaleTimeString();

  return (
    <div className="clock-wrapper">
      <div className="clock-title">{title}</div>
      <div className="time-zone">GMT{timezone >= 0 ? '+' : ''}{timezone}</div>
      <div className="clock">
        <div 
          className="hand hour-hand"
          style={{
            transform: `rotate(${hourDeg}deg)`,
            transition: secondDeg === 0 ? 'none' : 'transform 0.3s cubic-bezier(0.4, 2.5, 0.5, 1)'
          }}
        />
        <div 
          className="hand minute-hand"
          style={{
            transform: `rotate(${minuteDeg}deg)`,
            transition: secondDeg === 0 ? 'none' : 'transform 0.3s cubic-bezier(0.4, 2.5, 0.5, 1)'
          }}
        />
        <div 
          className="hand second-hand"
          style={{
            transform: `rotate(${secondDeg}deg)`,
            transition: secondDeg === 0 ? 'transform 0s' : 'transform 0.3s cubic-bezier(0.4, 2.5, 0.5, 1)'
          }}
        />
        <div className="center-dot" />
      </div>
      <div className="digital-time">{timeString}</div>
      <button className="remove-btn" onClick={onRemove} aria-label="Remove clock">
        ×
      </button>
    </div>
  );
}

export default Clock;
