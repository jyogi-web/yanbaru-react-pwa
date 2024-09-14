import React from 'react';
import DeviceSensor from './components/DeviceSensor';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>React Accelerometer</h1>
        <DeviceSensor />
      </header>
    </div>
  );
};

export default App;
