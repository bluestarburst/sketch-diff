import logo from './logo.svg';
import './App.css';
import Doodle from './Doodle';
import Title from './Title';

function App() {

  // model code should go here probably!
  
  // and other stuff too!

  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <Title/>
        <Doodle/>
        { /* a button to save the doodle */}
        
      </header>
    </div>
  );
}

export default App;
