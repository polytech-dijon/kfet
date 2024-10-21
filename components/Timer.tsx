import React, { useState, useEffect } from "react";
import { ONE_SECOND } from "../utils/const";

const calculateTimeElapsed = (s_t: number) => Math.floor((Date.now() - s_t)/ONE_SECOND)

/**
 * A timer that displays the time elapsed in seconds and changes color based on the time elapsed
 * @param long_wait_time The time in seconds to wait before the timer turns red
 * @param acceptable_wait_time The time in seconds to wait before the timer turns yellow 
 * @param time_elapsed The time in seconds that has already elapsed
 */
export const Timer = ({ acceptable_wait_time, long_wait_time, created_at }: { acceptable_wait_time: number, long_wait_time: number, created_at: number }) => {
  const [seconds, setSeconds] = useState(calculateTimeElapsed(created_at));
  


  useEffect(() => {
    setSeconds(calculateTimeElapsed(created_at));
    const timerId = setTimeout(() => setSeconds(seconds + 1), ONE_SECOND);
    return () => clearTimeout(timerId); // Cleanup timer

  }, [created_at, seconds]);

  const format = (seconds: number) => {
    return (seconds / 60) >= 1 ? `${Math.floor(seconds / 60)}m ${seconds % 60}s` : `${seconds % 60}s`;
  }

  const processClass = (seconds: number) => {
    return seconds < acceptable_wait_time ? "text-green-600" : seconds < long_wait_time ? "text-yellow-600" : "text-red-600";
  }
  return <span className={processClass(seconds)}>{format(seconds)}</ span>;
};
