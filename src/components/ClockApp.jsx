import { useState, useEffect } from 'react';

import Clock from './Clock';
import initialClocks from '../data/clocks.json';

function ClockApp() {
  const [clocks, setClocks] = useState(() => {
    // Пробуем загрузить часы из localStorage, если их там нет, используем начальные данные
    const savedClocks = localStorage.getItem('world-clocks');
    return savedClocks ? JSON.parse(savedClocks) : initialClocks;
  });
  
  // Сохраняем часы в localStorage при их изменении
  useEffect(() => {
    localStorage.setItem('world-clocks', JSON.stringify(clocks));
  }, [clocks]);
  const [title, setTitle] = useState('');
  const [timezone, setTimezone] = useState('');
  const [error, setError] = useState('');

  const addClock = () => {
    setError('');
    
    const trimmedTitle = title.trim();
    
    if (!trimmedTitle) {
      setError('Пожалуйста, введите название города');
      return;
    }

    if (!timezone || isNaN(timezone)) {
      setError('Пожалуйста, введите корректное значение часового пояса');
      return;
    }

    const timezoneNum = parseFloat(timezone);
    if (timezoneNum < -12 || timezoneNum > 14) {
      setError('Часовой пояс должен быть в диапазоне от -12 до +14');
      return;
    }

    // Проверяем, существует ли город с таким названием (без учета регистра)
    const cityExists = clocks.some(clock => 
      clock.title.toLowerCase() === trimmedTitle.toLowerCase()
    );
    
    if (cityExists) {
      setError(`Город "${trimmedTitle}" уже существует`);
      return;
    }

    // Если город не найден, добавляем его
    setClocks(prevClocks => [
      ...prevClocks,
      {
        id: Date.now(),
        title: trimmedTitle,
        timezone: timezoneNum
      }
    ]);

    setTitle('');
    setTimezone('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addClock();
    }
  };

  const removeClock = (id) => {
    setClocks(clocks.filter(clock => clock.id !== id));
  };
  
  const resetToDefault = () => {
    if (window.confirm('Вы уверены, что хотите сбросить все часы к начальным значениям?')) {
      setClocks([...initialClocks]);
    }
  };

  return (
    <div className="clock-app">
      <h1 className="app-title">Мировое время</h1>
      
      <div className="form-container">
        <div className="form">
          <div className="form-group">
            <label htmlFor="clock-title">Название</label>
            <input
              id="clock-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g. New York"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="clock-timezone">Временная зона (GMT)</label>
            <input
              id="clock-timezone"
              type="number"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g. -5"
              min="-12"
              max="14"
              step="0.5"
            />
          </div>
          
          <div className="buttons">
            <button type="button" className="add-button" onClick={addClock}>
              Добавить
            </button>
            <button 
              type="button" 
              className="reset-button" 
              onClick={resetToDefault}
              title="Сбросить к начальным настройкам"
            >
              Сбросить
            </button>
          </div>
        </div>
        
        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="clocks-container">
        {clocks.map(clock => (
          <Clock
            key={clock.id}
            title={clock.title}
            timezone={clock.timezone}
            onRemove={() => removeClock(clock.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default ClockApp;
