import React, { useEffect, useState } from 'react';

// 加速度データのインターフェースを定義
interface AccelerationData {
  x: number | null;
  y: number | null;
  z: number | null;
}

const Accelerometer: React.FC = () => {
  // 加速度データの状態を管理
  const [acceleration, setAcceleration] = useState<AccelerationData>({ x: null, y: null, z: null });

  useEffect(() => {
    // DeviceMotionEventを処理する関数
    const handleMotionEvent = (event: DeviceMotionEvent) => {
      // 加速度データを更新
      setAcceleration({
        x: event.acceleration?.x ?? 0, 
        y: event.acceleration?.y ?? 0, 
        z: event.acceleration?.z ?? 0,
      });
    };

    // DeviceMotionEventのサポートをチェックしてイベントリスナーを追加
    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', handleMotionEvent);
    } else {
      console.log("DeviceMotionEvent is not supported on this device.");
    }

    // クリーンアップ関数でイベントリスナーを削除
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
