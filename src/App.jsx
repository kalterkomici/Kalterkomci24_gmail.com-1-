import React from 'react';
import RiskMatrix from './RiskMatrix';
import './App.css';

const App = () => {
  return (
    <div className="App" style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "50px",
      backgroundColor: "#f4f7fb",
      minHeight: "100vh",
    }}>
      <RiskMatrix />
    </div>
  );
};

export default App;
