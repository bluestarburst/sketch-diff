import logo from './logo.svg';
import './App.css';
import Doodle from './Doodle';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Doodle/>
      </header>
    </div>
  );
}

export default App;