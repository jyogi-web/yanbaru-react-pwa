import React from 'react';
import Accelerometer from './components/Accelerometer';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>React Accelerometer</h1>
        <Accelerometer />
      </header>
    </div>
  );
}

export default App;
