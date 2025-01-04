import React, { useState, useEffect } from "react";
import { ONE_SECOND } from "../utils/const";

export const Countdown = ({ initialSeconds }: { initialSeconds: number }) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    if (seconds !== initialSeconds) {
      setSeconds(initialSeconds);
      setIsDeleted(false);
    }
  }, [initialSeconds]);

  useEffect(() => {
    if (seconds <= 0) {
      setIsDeleted(true);
      return;
    }

    const timerId = setInterval(() => {
      setSeconds((prev) => Math.max(prev - ONE_SECOND, 0));
    }, 1000);

    return () => clearInterval(timerId);
  }, [seconds]);

  if (isDeleted) {
    return <span className="text-red-600">Deleted</span>;
  }

  return (
    <span
      className={
        seconds > 30
          ? "text-green-600"
          : seconds > 10
          ? "text-yellow-600"
          : "text-red-600"
      }
    >
      {seconds > 0 ? `${Math.floor(seconds / 60)}m ${seconds % 60}s` : "Deleted"}
    </span>
  );
};
