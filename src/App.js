
import './App.css';
import Doodle from './Doodle';
import TitleMake from './Title';
import Title from './Title';
import UI from './UI';
import  {TypeWrite1} from './TypeWrite';
import  {TypeWrite2} from './TypeWrite';
import  {TypeWrite3} from './TypeWrite';
import  {TypeWrite4} from './TypeWrite';
import ColorPal from './Color';
// import  Background from './Background';
import { useState } from 'react';
// import ColorPalette from './Color';


  // model code should go here probably!
 
  // and other stuff too!

function App() {
  const [brushSize, setVar] = useState(1);
  return (
    <div className="App">
        x
      <header className="App-header"> 
      <div className="backy">
        <p>
        </p>
      </div>
      <div id="TitleStuff">
          <TitleMake/>
        </div>
      </header>
   
    <div className="encap">
      <div className="alignment">
        <div className="DrawSection">
          <Doodle brushSize={brushSize} />
          <br></br>
          <ColorPal/>
        </div>
          <UI brushSize={brushSize} setVar={setVar}/>
          <br></br>
          
          <div className="Typed_Stuff">
            <TypeWrite1/>
            <TypeWrite2/>
            <TypeWrite3/>
            <TypeWrite4/>
          </div>
         </div>
          {/* <ColorPalette/> */}
          
      </div>
    </div> 
  );
}

export default App;
