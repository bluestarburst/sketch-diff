import logo from './logo.svg';
import './App.css';
import Doodle from './Doodle';
import TitleMake from './Title';
import Title from './Title';
import UI from './UI';
import React, { useState } from 'react';
import { render } from 'react-dom';
import pen from './pen.png';

import './App.css'
import './index.css'
import './Background.css'
import './Title.css'
import './Doodle.css'
import './UI.css'


// model code should go here probably!

// and other stuff too!

function App() {
  const [brushSize, setVar] = useState(1);
  return (
    <div className="App">
      <header className="App-header" style={{backgroundImage: pen}}>
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <TitleMake />
        <Doodle brushSize={brushSize} />
        <UI brushSize={brushSize} setVar={setVar} />
        { /*  */}

      </header>
    </div>
  );
}

export default App;

render((
  <App />
), document.getElementById('root'));
