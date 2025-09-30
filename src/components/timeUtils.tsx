import React from 'react';

export const formatTime = (seconds: number): React.ReactElement => {
  if (seconds === 0) return <span>0<span className="text-sm">分</span></span>;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours === 0) {
    return <span>{minutes}<span className="text-sm">分</span></span>;
  } else if (minutes === 0) {
    return <span>{hours}<span className="text-sm">時</span></span>;
  } else {
    return <span>{hours}<span className="text-sm">時</span>{minutes}<span className="text-sm">分</span></span>;
  }
};