import React, { useState, useEffect, useRef } from 'react';

interface TimeDisplay {
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

const App: React.FC = () => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [time, setTime] = useState<TimeDisplay>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0
  });
  const [laps, setLaps] = useState<TimeDisplay[]>([]);
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const elapsedTimeRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startTimer = () => {
    if (isRunning) return;
    
    setIsRunning(true);
    startTimeRef.current = Date.now() - elapsedTimeRef.current;
    
    intervalRef.current = window.setInterval(() => {
      const currentTime = Date.now();
      const startTime = startTimeRef.current || currentTime;
      const totalElapsedTime = currentTime - startTime;
      elapsedTimeRef.current = totalElapsedTime;
      
      const milliseconds = Math.floor((totalElapsedTime % 1000) / 10);
      const seconds = Math.floor((totalElapsedTime / 1000) % 60);
      const minutes = Math.floor((totalElapsedTime / (1000 * 60)) % 60);
      const hours = Math.floor(totalElapsedTime / (1000 * 60 * 60));
      
      setTime({ hours, minutes, seconds, milliseconds });
    }, 10);
  };

  const pauseTimer = () => {
    if (!isRunning) return;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setIsRunning(false);
  };

  const resetTimer = () => {
    pauseTimer();
    setTime({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
    setLaps([]);
    elapsedTimeRef.current = 0;
    startTimeRef.current = null;
  };

  const addLap = () => {
    if (!isRunning) return;
    setLaps(prevLaps => [...prevLaps, time]);
  };

  const formatTime = (time: TimeDisplay): string => {
    return `${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}:${time.seconds.toString().padStart(2, '0')}.${time.milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Time Lapse Chronometer</h1>
      
      <div style={styles.display}>
        <span style={styles.timeText}>{formatTime(time)}</span>
      </div>
      
      <div style={styles.controls}>
        {!isRunning ? (
          <button style={styles.button} onClick={startTimer}>Start</button>
        ) : (
          <button style={styles.button} onClick={pauseTimer}>Pause</button>
        )}
        <button style={styles.button} onClick={resetTimer}>Reset</button>
        <button style={styles.button} onClick={addLap} disabled={!isRunning}>Lap</button>
      </div>
      
      {laps.length > 0 && (
        <div style={styles.lapsContainer}>
          <h2 style={styles.lapsTitle}>Laps</h2>
          <div style={styles.lapsList}>
            {laps.map((lap, index) => (
              <div key={index} style={styles.lapItem}>
                <span style={styles.lapNumber}>Lap {laps.length - index}</span>
                <span style={styles.lapTime}>{formatTime(lap)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center' as const,
    backgroundColor: '#f5f5f5',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
  },
  title: {
    color: '#333',
    marginBottom: '20px'
  },
  display: {
    backgroundColor: '#333',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  timeText: {
    fontSize: '48px',
    fontWeight: 'bold' as const,
    color: '#fff',
    fontFamily: 'monospace'
  },
  controls: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '20px'
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    outline: 'none'
  },
  lapsContainer: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '15px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },
  lapsTitle: {
    fontSize: '20px',
    marginBottom: '10px',
    color: '#333'
  },
  lapsList: {
    maxHeight: '300px',
    overflowY: 'auto' as const,
    padding: '5px'
  },
  lapItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #eee'
  },
  lapNumber: {
    fontWeight: 'bold' as const,
    color: '#555'
  },
  lapTime: {
    fontFamily: 'monospace',
    fontSize: '16px'
  }
};

export default App;