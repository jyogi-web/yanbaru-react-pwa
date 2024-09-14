import React, { useEffect, useState } from 'react';

interface MotionData {
    加速度: { x: number | null; y: number | null; z: number | null };
    重力を含む加速度: { x: number | null; y: number | null; z: number | null };
    回転速度: { alpha: number | null; beta: number | null; gamma: number | null };
    間隔: number | null;
}

const THRESHOLD = 10; 
const SCORE_INCREMENT = 10; 

const DeviceSensor: React.FC = () => {
  const [motionData, setMotionData] = useState<MotionData>({
    加速度: { x: null, y: null, z: null },
    重力を含む加速度:{ x: null, y: null, z: null },
    回転速度: { alpha: null, beta: null, gamma: null },
    間隔:  null,
  });

  const [prevAcceleration, setPrevAcceleration] = useState<{ x: number; y: number; z: number } | null>(null);
  const [score, setScore] = useState<number>(0);

  const handleMotionEvent = (event: DeviceMotionEvent) => {
    const newAcceleration = {
      x: event.acceleration?.x ?? 0,
      y: event.acceleration?.y ?? 0,
      z: event.acceleration?.z ?? 0,
    };

    setMotionData((prevData) => ({
      ...prevData,
      加速度: newAcceleration,
    }));

    // 加速度の変化量を計算
    if (prevAcceleration) {
      const deltaX = Math.abs(newAcceleration.x - prevAcceleration.x);
      const deltaY = Math.abs(newAcceleration.y - prevAcceleration.y);
      const deltaZ = Math.abs(newAcceleration.z - prevAcceleration.z);

      // 変化量がしきい値を超えた場合にスコアを加算
      if (deltaX > THRESHOLD || deltaY > THRESHOLD || deltaZ > THRESHOLD) {
        setScore((prevScore) => prevScore + SCORE_INCREMENT);
      }
    }

    // 現在の加速度を前回の加速度として保存
    setPrevAcceleration(newAcceleration);
  };

  const handleOrientationEvent = (event: DeviceOrientationEvent) => {
    console.log('Orientation data:', event);
  };

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
    return () => {
      window.removeEventListener('devicemotion', handleMotionEvent);
      window.removeEventListener('deviceorientation', handleOrientationEvent);
    };
  }, []);

  // 許可をリクエストするボタンのクリックイベント
  const handleButtonClick = () => {
    requestPermissions();
  };

  const formatNumber = (num: number | null) => (num !== null ? num.toFixed(2) : 'N/A');

  return (
    <div>
      <h2>Device Motion Data</h2>
      <button onClick={handleButtonClick}>Request Permission</button>
    <div>
        <h3>加速度 (Acceleration)</h3>
        <p>X: {formatNumber(motionData.加速度.x)}</p>
        <p>Y: {formatNumber(motionData.加速度.y)}</p>
        <p>Z: {formatNumber(motionData.加速度.z)}</p>

        {/* <h3>重力を含む加速度 (Acceleration Including Gravity)</h3>
        <p>X: {formatNumber(motionData.重力を含む加速度.x)}</p>
        <p>Y: {formatNumber(motionData.重力を含む加速度.y)}</p>
        <p>Z: {formatNumber(motionData.重力を含む加速度.z)}</p>

        <h3>回転速度 (Rotation Rate)</h3>
        <p>Alpha: {formatNumber(motionData.回転速度.alpha)}</p>
        <p>Beta: {formatNumber(motionData.回転速度.beta)}</p>
        <p>Gamma: {formatNumber(motionData.回転速度.gamma)}</p>

        <h3>間隔 (Interval)</h3>
        <p>{motionData.間隔 !== null ? motionData.間隔.toFixed(2) : 'N/A'}</p> */}
        <h3>スコア (Score): {score}</h3>
      </div>
    </div>
  );
};

export default DeviceSensor;
