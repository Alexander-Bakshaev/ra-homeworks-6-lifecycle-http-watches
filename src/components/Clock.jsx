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

  const hourDeg = ((hours % 12) + minutes / 60) * 30;
  const minuteDeg = minutes * 6;
  const secondDeg = seconds * 6;

  const timeString = local.toLocaleTimeString();

  return (
    <div className="clock-wrapper">
      <div className="clock-title">{title}</div>
      <div className="time-zone">GMT{timezone >= 0 ? '+' : ''}{timezone}</div>
      <div className="clock">
        <div
          className="hand hour-hand"
          style={{ transform: `rotate(${hourDeg}deg)` }}
        />
        <div
          className="hand minute-hand"
          style={{ transform: `rotate(${minuteDeg}deg)` }}
        />
        <div
          className="hand second-hand"
          style={{ transform: `rotate(${secondDeg}deg)` }}
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
