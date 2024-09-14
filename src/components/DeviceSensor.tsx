import React, { useEffect, useState } from 'react';

interface MotionData {
    加速度: { x: number | null; y: number | null; z: number | null };
    重力を含む加速度: { x: number | null; y: number | null; z: number | null };
    回転速度: { alpha: number | null; beta: number | null; gamma: number | null };
    間隔: number | null;
}

const DeviceSensor: React.FC = () => {
  const [motionData, setMotionData] = useState<MotionData>({
    加速度: { x: null, y: null, z: null },
    重力を含む加速度:{ x: null, y: null, z: null },
    回転速度: { alpha: null, beta: null, gamma: null },
    間隔:  null,
  });

  const handleMotionEvent = (event: DeviceMotionEvent) => {
    setMotionData({
        加速度:  {
        x: event.acceleration?.x ?? 0,
        y: event.acceleration?.y ?? 0,
        z: event.acceleration?.z ?? 0,
      },
      重力を含む加速度:{
        x: event.accelerationIncludingGravity?.x ?? 0,
        y: event.accelerationIncludingGravity?.y ?? 0,
        z: event.accelerationIncludingGravity?.z ?? 0,
      },
      回転速度:{
        alpha: event.rotationRate?.alpha ?? 0,
        beta: event.rotationRate?.beta ?? 0,
        gamma: event.rotationRate?.gamma ?? 0,
      },
      間隔:  event.interval ?? 0,
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
