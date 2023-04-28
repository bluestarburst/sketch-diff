
import './App.css';
import Doodle from './Doodle';
import TitleMake from './Title';
import Title from './Title';
import UI from './UI';
import React, { useState } from 'react';
import { render } from 'react-dom';
// import pen from './pen.png';
import ColorPal from './Color';
import { TypeWrite1 } from './TypeWrite';
import { TypeWrite2 } from './TypeWrite';
import { TypeWrite3 } from './TypeWrite';
import { TypeWrite4 } from './TypeWrite';
import Color from './Color';
// import  Background from './Background';
// import { useState } from 'react';`
// import ColorPalette from './Color';

import './App.css'
import './index.css'
import './Background.css'
import './Title.css'
import './Doodle.css'
import './UI.css'
import { useEffect } from 'react';


// model code should go here probably!

// and other stuff too!

function App() {
  const [brushSize, setVar] = useState(14);
  const [brushColor, setColor] = useState("#000");
  return (
    <div className="App">

      <header className="App-header">
        <div className="backy">
          <p>
          </p>
        </div>
        <div className="backy2">
          <div id="TitleStuff">
            <TitleMake />
          </div>
        </div>
      </header>

      <div className="encap">
        <div className="alignment">
          <div className='rows'>
            <div className="DrawSection">
              <Doodle brushSize={brushSize} brushColor={brushColor} />
              <br></br>
              <Color brushColor={brushColor} setVar={setColor} />
            </div>
            <UI className="circles" brushSize={brushSize} setVar={setVar} />
          </div>


          {/* <br/> */}

          <div className="Typed_Stuff">
            <TypeWrite1 />
            <TypeWrite2 />
            <TypeWrite3 />
            <TypeWrite4 />
          </div>
        </div>
        {/* <ColorPalette/> */}

      </div>
    </div>
  );
}

export default App;

render((
  <App />
), document.getElementById('root'));
