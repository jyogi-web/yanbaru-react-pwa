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

    const requestPermission = async () => {
      if (typeof DeviceMotionEvent !== 'undefined' && 'requestPermission' in DeviceMotionEvent) {
        try {
          const permissionState = await (DeviceMotionEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission();
          if (permissionState === 'granted') {
            window.addEventListener('devicemotion', handleMotionEvent);
          } else {
            console.log('Permission denied for DeviceMotionEvent.');
          }
        } catch (error) {
          console.error('Error requesting permission for DeviceMotionEvent:', error);
        }
      } else if (window.DeviceMotionEvent) {
        // 許可が不要なブラウザ（多くの Android ブラウザなど）での処理
        window.addEventListener('devicemotion', handleMotionEvent);
      } else {
        console.log("DeviceMotionEvent is not supported on this device.");
      }
    };

    requestPermission();

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
