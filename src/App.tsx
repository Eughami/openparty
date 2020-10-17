import React from 'react';
import './App.css';
import Homepage from './components/homepage';
import Navbar from './components/navbar';

import 'antd/dist/antd.css';


const App = () => {
  return (
    <div className="App">

      <Navbar />
      <Homepage/>
    </div>
  );
}

export default App;
