import React, { useState, useEffect, useRef } from "react";
import { Execution } from "@/types";

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

  const calculateRuntime = (execution: Execution) => {
    if (!execution.startTime || !execution.endTime) {
      return "N/A";
    }

    try {
      const start = new Date(execution.startTime);
      const end = new Date(execution.endTime);
      const diff = end.getTime() - start.getTime();
      const hours = Math.floor(diff / 1000 / 60 / 60);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      return `${hours}h ${minutes}m ${seconds}s`;
    } catch (error) {
      return "N/A";
    }
  }

  return { useInterval, calculateRuntime };
}