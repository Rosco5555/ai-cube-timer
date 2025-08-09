// App.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';

// Timer component
const Timer: React.FC<{
  isRunning: boolean;
  time: number;
  onTimeUpdate: (time: number) => void;
}> = ({ isRunning, time, onTimeUpdate }) => {
  useEffect(() => {
    let interval: any = null;
    
    if (isRunning) {
      const startTime = Date.now() - time;
      interval = setInterval(() => {
        onTimeUpdate(Date.now() - startTime);
      }, 10);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, time, onTimeUpdate]);

  const formatTime = (ms: number): string => {
    const totalSeconds = ms / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    if (minutes > 0) {
      return `${minutes}:${seconds.toFixed(2).padStart(5, '0')}`;
    }
    return seconds.toFixed(2);
  };

  return (
    <div className="timer-display">
      {formatTime(time)}
    </div>
  );
};

// Scramble generator using basic algorithm (TNoodle-like)
const generateScramble = (): string => {
  const moves = ['U', 'D', 'R', 'L', 'F', 'B'];
  const modifiers = ['', '\'', '2'];
  const scrambleLength = 20;
  const scramble: string[] = [];
  let lastMove = '';
  let lastAxis = '';

  const getAxis = (move: string): string => {
    if (move === 'U' || move === 'D') return 'UD';
    if (move === 'R' || move === 'L') return 'RL';
    if (move === 'F' || move === 'B') return 'FB';
    return '';
  };

  for (let i = 0; i < scrambleLength; i++) {
    let move: string;
    let axis: string;
    
    do {
      move = moves[Math.floor(Math.random() * moves.length)];
      axis = getAxis(move);
    } while (move === lastMove || axis === lastAxis);
    
    const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
    scramble.push(move + modifier);
    lastMove = move;
    lastAxis = axis;
  }
  
  return scramble.join(' ');
};

// Statistics component
const Statistics: React.FC<{ times: number[] }> = ({ times }) => {
  const calculateAverage = (count: number): string => {
    if (times.length < count) return '-';
    
    const recentTimes = times.slice(-count);
    const sorted = [...recentTimes].sort((a, b) => a - b);
    
    // Remove highest and lowest
    const trimmed = sorted.slice(1, -1);
    
    if (trimmed.length === 0) return '-';
    
    const average = trimmed.reduce((sum, time) => sum + time, 0) / trimmed.length;
    return (average / 1000).toFixed(2);
  };

  const getBestAverage = (count: number): string => {
    if (times.length < count) return '-';
    
    let bestAvg = Infinity;
    
    for (let i = 0; i <= times.length - count; i++) {
      const subset = times.slice(i, i + count);
      const sorted = [...subset].sort((a, b) => a - b);
      const trimmed = sorted.slice(1, -1);
      const avg = trimmed.reduce((sum, time) => sum + time, 0) / trimmed.length;
      bestAvg = Math.min(bestAvg, avg);
    }
    
    return bestAvg === Infinity ? '-' : (bestAvg / 1000).toFixed(2);
  };


  const calculateSessionAverage = (): string => {
    const count = times.length;
    if (count < 3) return '-';
    const sorted = [...times].sort((a, b) => a - b);
    const trimmed = sorted.slice(1, -1);
    if (trimmed.length === 0) return '-';
    const average = trimmed.reduce((sum, time) => sum + time, 0) / trimmed.length;
    return (average / 1000).toFixed(2);
  };


  return (
    <div className="statistics">
      <h3>Statistics</h3>
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">Ao5:</span>
          <span className="stat-value">{calculateAverage(5)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Ao12:</span>
          <span className="stat-value">{calculateAverage(12)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Ao50:</span>
          <span className="stat-value">{calculateAverage(50)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Ao100:</span>
          <span className="stat-value">{calculateAverage(100)}</span>
        </div>
        <div className="stat-item"> 
          <span className="stat-label">Session Average:</span> 
          <span className="stat-value">{calculateSessionAverage()}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Best Ao5:</span>
          <span className="stat-value">{getBestAverage(5)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Best Ao12:</span>
          <span className="stat-value">{getBestAverage(12)}</span>
        </div>
        <div className="stat-item"> 
          <span className="stat-label">Best Ao50:</span> 
          <span className="stat-value">{getBestAverage(50)}</span>
         </div> 
         <div className="stat-item"> 
          <span className="stat-label">Best Ao100:</span> 
          <span className="stat-value">{getBestAverage(100)}</span> 
         </div>
      </div>
    </div>
  );
};

// Times list component
const TimesList: React.FC<{ times: number[]; onDeleteTime: (index: number) => void }> = ({ times, onDeleteTime }) => {
  const formatTime = (ms: number): string => {
    const totalSeconds = ms / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    if (minutes > 0) {
      return `${minutes}:${seconds.toFixed(2).padStart(5, '0')}`;
    }
    return seconds.toFixed(2);
  };

  return (
    <div className="times-list">
      <h3>Times</h3>
      <div className="times-container">
        {times.length === 0 ? (
          <p className="no-times">No times recorded yet</p>
        ) : (
          [...times].reverse().map((time, index) => (
            <div key={times.length - index - 1} className="time-item">
              <span className="time-number">{times.length - index}.</span>
              <span className="time-value">{formatTime(time)}</span>
              <button 
                className="delete-time"
                onClick={() => onDeleteTime(times.length - index - 1)}
                aria-label="Delete time"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Main App component
const App: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [times, setTimes] = useState<number[]>([]);
  const [scramble, setScramble] = useState('');
  const [isReady, setIsReady] = useState(false);
  const spacebarPressed = useRef(false);

  // Load times from localStorage on mount
  useEffect(() => {
    const savedTimes = localStorage.getItem('cubeTimes');
    if (savedTimes) {
      setTimes(JSON.parse(savedTimes));
    }
    setScramble(generateScramble());
  }, []);

  // Save times to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cubeTimes', JSON.stringify(times));
  }, [times]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space') {
      e.preventDefault();
      
      if (!spacebarPressed.current) {
        spacebarPressed.current = true;
        
        if (isRunning) {
          // Stop the timer
          setIsRunning(false);
          setTimes(prev => [...prev, currentTime]);
          setScramble(generateScramble());
          setIsReady(false);
        } else {
          // Prepare to start
          setIsReady(true);
          setCurrentTime(0);
        }
      }
    }
  }, [isRunning, currentTime]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space') {
      e.preventDefault();
      spacebarPressed.current = false;
      
      if (isReady && !isRunning) {
        // Start the timer
        setIsRunning(true);
        setIsReady(false);
      }
    }
  }, [isReady, isRunning]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const clearAllTimes = () => {
    if (window.confirm('Are you sure you want to clear all times?')) {
      setTimes([]);
      setCurrentTime(0);
      localStorage.removeItem('cubeTimes');
    }
  };

  const deleteTime = (index: number) => {
    setTimes(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Rubik's Cube Timer</h1>
      </header>
      
      <main className="main-content">
        <div className="scramble-section">
          <h3>Scramble</h3>
          <div className="scramble">{scramble}</div>
        </div>
        
        <div className={`timer-section ${isReady ? 'ready' : ''} ${isRunning ? 'running' : ''}`}>
          <Timer 
            isRunning={isRunning} 
            time={currentTime} 
            onTimeUpdate={setCurrentTime}
          />
          <p className="timer-hint">
            {isRunning ? 'Press spacebar to stop' : 
             isReady ? 'Release to start' : 
             'Hold spacebar to start'}
          </p>
        </div>
        
        <div className="content-grid">
          <div className="left-section">
            <Statistics times={times} />
            <button className="clear-button" onClick={clearAllTimes}>
              Clear All Times
            </button>
          </div>
          
          <div className="right-section">
            <TimesList times={times} onDeleteTime={deleteTime} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;