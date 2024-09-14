import React, { useEffect, useState } from 'react';

interface Acceleration {
  x: number | null;
  y: number | null;
  z: number | null;
}

const Accelerometer: React.FC = () => {
  const [acceleration, setAcceleration] = useState<Acceleration>({ x: null, y: null, z: null });

  useEffect(() => {
    const handleMotionEvent = (event: DeviceMotionEvent) => {
      setAcceleration({
        x: event.acceleration?.x ?? 0,
        y: event.acceleration?.y ?? 0,
        z: event.acceleration?.z ?? 0,
      });
    };

    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', handleMotionEvent);
    } else {
      console.log("DeviceMotionEvent is not supported on this device.");
    }

    return () => {
      window.removeEventListener('devicemotion', handleMotionEvent);
    };
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Accelerometer Data</h2>
      <p>X: {acceleration.x?.toFixed(2)}</p>
      <p>Y: {acceleration.y?.toFixed(2)}</p>
      <p>Z: {acceleration.z?.toFixed(2)}</p>
    </div>
  );
};

export default Accelerometer;
