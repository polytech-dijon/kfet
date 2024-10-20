import React, { useState, useEffect } from "react";

const ONE_SECOND = 1000;

export const Countdown = ({ initialSeconds }: { initialSeconds: number }) => {
  const [seconds, setSeconds] = useState((initialSeconds-(initialSeconds % ONE_SECOND)) / ONE_SECOND);

  useEffect(() => {
    if (seconds > 0) {
      const timerId = setTimeout(() => setSeconds(seconds - 1), ONE_SECOND);
      return () => clearTimeout(timerId); // Cleanup timer
    }
  }, [seconds]);

  const format = (seconds : number)=>{
    return seconds / 60 > 1 ? `${Math.floor(seconds / 60)}m ${seconds % 60}s` : `${seconds % 60}s`;
  }

  const processClass = (seconds : number)=>{
    return seconds >30 ? "text-green-600" : seconds > 60 ? "text-yellow-600" : "text-red-600";
  }
  return <span className={processClass(seconds)}> {seconds > 0 ? format(seconds) : "Deleted"}</ span>;
};
