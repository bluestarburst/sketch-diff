import logo from './logo.svg';
import './App.css';
import Doodle from './Doodle';
import TitleMake from './Title';
import Title from './Title';
import UI from './UI';
import { useState } from 'react';


  // model code should go here probably!
 
  // and other stuff too!

function App() {
  const [brushSize, setVar] = useState(1);
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <TitleMake/>
        <Doodle/>
        <UI brushSize={brushSize} setVar={setVar}/>
        { /*  */}
        
      </header>
    </div>  
  );
}

export default App;
