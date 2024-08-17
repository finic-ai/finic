import React, { useState, useEffect, useRef } from "react";

export default function useUtils() {
  const useInterval = (callback: any, delay: any) => {
    const savedCallback = useRef<any>();

    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        const id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  };

  return { useInterval };
}
