import React, { useState, useEffect } from "react";

const ONE_SECOND = 1000;

export const Timer = ({ acceptable_wait_time, long_wait_time  }: { acceptable_wait_time: number, long_wait_time : number }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (seconds > 0) {
      const timerId = setTimeout(() => setSeconds(seconds + 1), ONE_SECOND);
      return () => clearTimeout(timerId); // Cleanup timer
    }
  }, [seconds]);

  const format = (seconds : number)=>{
    return seconds / 60 > 1 ? `${Math.floor(seconds / 60)}m ${seconds % 60}s` : `${seconds % 60}s`;
  }

  const processClass = (seconds : number)=>{
    return seconds < acceptable_wait_time ? "text-green-600" : seconds < acceptable_wait_time ? "text-yellow-600" : "text-red-600";
  }
  return <span className={processClass(seconds)}> {seconds > 0 ? format(seconds) : "Deleted"}</ span>;
};
