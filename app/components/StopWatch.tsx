import React, { useEffect } from 'react';

interface StopWatchProps {
  isRunning: boolean;
}

const StopWatch: React.FC<StopWatchProps> = ({ isRunning }) => {
  const [time, setTime] = React.useState<number>(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTime(prev => prev + 10);
      }, 10);
    }

    return () => {
      if (interval !== null) clearInterval(interval);
    };
  }, [isRunning]);

  return (
    <div>
      <span>{("0" + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
      <span>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}:</span>
      <span>{("0" + ((time / 10) % 100)).slice(-2)}</span>
    </div>
  );
};

export default StopWatch;
