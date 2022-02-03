// import logo from './logo.svg';
import React, { Component } from 'react';
import './App.css';
export default App;

class FileSelector extends Component {

  showFile = async (e) => {
    e.preventDefault()
    const reader = new FileReader()
    reader.onload = async (e) => {
      const text = (e.target.result)
      const data = JSON.parse(text)
      console.log(data)
      alert("Open web console to view data")
    };
    const raw = reader.readAsText(e.target.files[0])
  }

  render = () => {
    return (
      <div className="pane">
        <input type="file" onChange={(e) => this.showFile(e)} />
      </div>
    )
  }
}

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
          <FileSelector />
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
