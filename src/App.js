// import logo from './logo.svg';
import './App.css';
export default App;

function DataView(props){
  return(
     <div className="pane">
        <header>
        <p>{props.title}</p>
        </header>
     </div>
  );
}

function App() {
  return (
    <div className="App">
      <div className="row">
        <div className="column">
        <form className = "pane">
            <input directory="" webkitdirectory="" type="file" />
        </form>
        </div>
        <div className="column">
            <DataView title="Map"/>
        </div>
        <div className="column">
            <DataView title="Tree"/>
        </div>
      </div>
      <div className = "row">
        <div className="column">
            <DataView title="Epi"/>
        </div>
      </div>
      <div className = "row">
        <div className="column">
            <DataView title="Grid"/>
        </div>
      </div>
 </div>
  );
}
