import React, { useState, useEffect } from "react";

const ONE_SECOND = 1000;

/**
 * A timer that displays the time elapsed in seconds and changes color based on the time elapsed
 * @param long_wait_time The time in seconds to wait before the timer turns red
 * @param acceptable_wait_time The time in seconds to wait before the timer turns yellow 
 * @param time_elapsed The time in seconds that has already elapsed
 */
export const Timer = ({ acceptable_wait_time, long_wait_time, time_elapsed = 0 }: { acceptable_wait_time: number, long_wait_time: number, time_elapsed: number }) => {
  const [seconds, setSeconds] = useState(time_elapsed);

  // Convert seconds to milliseconds

  useEffect(() => {
    setSeconds(time_elapsed);
    const timerId = setTimeout(() => setSeconds(seconds + 1), ONE_SECOND);
    return () => clearTimeout(timerId); // Cleanup timer

  }, [time_elapsed, seconds]);

  const format = (seconds: number) => {
    return seconds / 60 > 1 ? `${Math.floor(seconds / 60)}m ${seconds % 60}s` : `${seconds % 60}s`;
  }

  const processClass = (seconds: number) => {
    return seconds < acceptable_wait_time ? "text-green-600" : seconds < long_wait_time ? "text-yellow-600" : "text-red-600";
  }
  return <span className={processClass(seconds)}>{format(seconds)}</ span>;
};
