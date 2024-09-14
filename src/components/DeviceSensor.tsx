import React, { useEffect, useState } from 'react';

// インターフェース定義
interface MotionData {
  acceleration: { x: number | null; y: number | null; z: number | null };
  accelerationIncludingGravity: { x: number | null; y: number | null; z: number | null };
  rotationRate: { alpha: number | null; beta: number | null; gamma: number | null };
  interval: number | null;
}

interface OrientationData {
  absolute: boolean | null;
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
}

const DeviceSensor: React.FC = () => {
  // 状態を管理
  const [motionData, setMotionData] = useState<MotionData>({
    acceleration: { x: null, y: null, z: null },
    accelerationIncludingGravity: { x: null, y: null, z: null },
    rotationRate: { alpha: null, beta: null, gamma: null },
    interval: null,
  });

  const [orientationData, setOrientationData] = useState<OrientationData>({
    absolute: null,
    alpha: null,
    beta: null,
    gamma: null,
  });

  useEffect(() => {
    // モーションデータを処理する関数
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

    // オリエンテーションデータを処理する関数
    const handleOrientationEvent = (event: DeviceOrientationEvent) => {
      setOrientationData({
        absolute: event.absolute ?? false,
        alpha: event.alpha ?? 0,
        beta: event.beta ?? 0,
        gamma: event.gamma ?? 0,
      });
    };

    // 許可をリクエストする関数
    const requestPermissions = async () => {
      try {
        if (typeof DeviceMotionEvent !== 'undefined' && 'requestPermission' in DeviceMotionEvent) {
          const response = await (DeviceMotionEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission();
          if (response === 'granted') {
            window.addEventListener('devicemotion', handleMotionEvent);
          } else {
            alert('DeviceMotionEvent permission denied');
          }
        } else {
          window.addEventListener('devicemotion', handleMotionEvent);
        }

        if (typeof DeviceOrientationEvent !== 'undefined' && 'requestPermission' in DeviceOrientationEvent) {
          const response = await (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission();
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

    requestPermissions();

    // クリーンアップ関数でイベントリスナーを削除
    return () => {
      window.removeEventListener('devicemotion', handleMotionEvent);
      window.removeEventListener('deviceorientation', handleOrientationEvent);
    };
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Device Motion Data</h2>
      <h4>Acceleration (without Gravity)</h4>
      <p>X: {motionData.acceleration.x?.toFixed(2)}</p>
      <p>Y: {motionData.acceleration.y?.toFixed(2)}</p>
      <p>Z: {motionData.acceleration.z?.toFixed(2)}</p>

      <h4>Acceleration (with Gravity)</h4>
      <p>X: {motionData.accelerationIncludingGravity.x?.toFixed(2)}</p>
      <p>Y: {motionData.accelerationIncludingGravity.y?.toFixed(2)}</p>
      <p>Z: {motionData.accelerationIncludingGravity.z?.toFixed(2)}</p>

      <h4>Rotation Rate</h4>
      <p>Alpha: {motionData.rotationRate.alpha?.toFixed(2)}</p>
      <p>Beta: {motionData.rotationRate.beta?.toFixed(2)}</p>
      <p>Gamma: {motionData.rotationRate.gamma?.toFixed(2)}</p>

      <h2>Device Orientation Data</h2>
      <p>Absolute: {orientationData.absolute ? 'Yes' : 'No'}</p>
      <p>Alpha (z): {orientationData.alpha?.toFixed(2)}</p>
      <p>Beta (x): {orientationData.beta?.toFixed(2)}</p>
      <p>Gamma (y): {orientationData.gamma?.toFixed(2)}</p>
    </div>
  );
};

export default DeviceSensor;
