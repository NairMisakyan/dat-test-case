import React from 'react';

import './components/plugin.css';
import CarComponent from './components/plugin.tsx';

const App: React.FC = () => {

  return (
    <div className="App">
      <header className="App-header">
        <CarComponent />
      </header>
    </div>
  );
};

export default App;
