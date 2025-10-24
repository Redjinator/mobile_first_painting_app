import { useState, useEffect } from 'react';

/**
 * Custom hook that calculates elapsed hours from a start time
 * Updates every second to show live time
 */
export function useTimer(startTime: Date | string | null | undefined): number {
  const [hours, setHours] = useState(0);

  useEffect(() => {
    if (!startTime) {
      setHours(0);
      return;
    }

    const calculateHours = () => {
      const start = new Date(startTime);
      const now = new Date();
      const elapsed = (now.getTime() - start.getTime()) / (1000 * 60 * 60);
      setHours(elapsed);
    };

    // Calculate immediately
    calculateHours();

    // Update every second
    const interval = setInterval(calculateHours, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return hours;
}
