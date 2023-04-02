import logo from './logo.svg';
import './App.css';
import Doodle from './Doodle';
import Title from './Title';
import UI from './UI';
import { useState } from 'react';

function App() {

  // model code should go here probably!
  const [brushSize, setVar] = useState(1);
  // and other stuff too!

  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <Title/>
        <Doodle/>
        <UI brushSize={brushSize} setVar={setVar}/>
        { /*  */}
        
      </header>
    </div>
  );
}

export default App;
