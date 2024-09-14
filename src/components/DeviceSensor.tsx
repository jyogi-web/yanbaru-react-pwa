import React, { useEffect, useState } from 'react';

interface MotionData {
  acceleration: { x: number | null; y: number | null; z: number | null };
  accelerationIncludingGravity: { x: number | null; y: number | null; z: number | null };
  rotationRate: { alpha: number | null; beta: number | null; gamma: number | null };
  interval: number | null;
}

const DeviceSensor: React.FC = () => {
  const [motionData, setMotionData] = useState<MotionData>({
    acceleration: { x: null, y: null, z: null },
    accelerationIncludingGravity: { x: null, y: null, z: null },
    rotationRate: { alpha: null, beta: null, gamma: null },
    interval: null,
  });

  const handleMotionEvent = (event: DeviceMotionEvent) => {
    setMotionData({
      acceleration: {
        x: event.acceleration?.x ?? 0,
        y: event.acceleration?.y ?? 0,
        z: event.acceleration?.z ?? 0,
      },
      accelerationIncludingGravity: {
        x: event.accelerationIncludingGravity?.x ?? 0,
        y: event.accelerationIncludingGravity?.y ?? 0,
        z: event.accelerationIncludingGravity?.z ?? 0,
      },
      rotationRate: {
        alpha: event.rotationRate?.alpha ?? 0,
        beta: event.rotationRate?.beta ?? 0,
        gamma: event.rotationRate?.gamma ?? 0,
      },
      interval: event.interval ?? 0,
    });
  };

  const handleOrientationEvent = (event: DeviceOrientationEvent) => {
    console.log('Orientation data:', event);
  };

  // 許可リクエスト関数
  const requestPermissions = async () => {
    try {
      if (typeof DeviceMotionEvent !== 'undefined' && 'requestPermission' in DeviceMotionEvent) {
        const response = await (DeviceMotionEvent as unknown as { requestPermission(): Promise<'granted' | 'denied'> }).requestPermission();
        if (response === 'granted') {
          window.addEventListener('devicemotion', handleMotionEvent);
        } else {
          alert('DeviceMotionEvent permission denied');
        }
      } else {
        window.addEventListener('devicemotion', handleMotionEvent);
      }

      if (typeof DeviceOrientationEvent !== 'undefined' && 'requestPermission' in DeviceOrientationEvent) {
        const response = await (DeviceOrientationEvent as unknown as { requestPermission(): Promise<'granted' | 'denied'> }).requestPermission();
        if (response === 'granted') {
          window.addEventListener('deviceorientation', handleOrientationEvent);
        } else {
          alert('DeviceOrientationEvent permission denied');
        }
      } else {
        window.addEventListener('deviceorientation', handleOrientationEvent);
      }
    } catch (error) {
      console.error('Error requesting sensor permissions:', error);
    }
  };

  useEffect(() => {
    // クリーンアップでイベントリスナーを削除
    return () => {
      window.removeEventListener('devicemotion', handleMotionEvent);
      window.removeEventListener('deviceorientation', handleOrientationEvent);
    };
  }, []);

  // 許可をリクエストするボタンのクリックイベント
  const handleButtonClick = () => {
    requestPermissions();
  };

  return (
    <div>
      <h2>Device Motion Data</h2>
      <button onClick={handleButtonClick}>Request Permission</button>
      <pre>{JSON.stringify(motionData, null, 2)}</pre>
    </div>
  );
};

export default DeviceSensor;
