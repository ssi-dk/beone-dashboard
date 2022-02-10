// import logo from './logo.svg';
import React, { Component, useState } from 'react';

import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil'

import ReactJson from 'react-json-view'

import './App.css';
export default App;

const sampleState = atom({
  key: 'sampleState',
  default: {},
});

function FileUploader(){
	const [samples, setSamples] = useRecoilState(sampleState);

	const changeHandler = async (event) => {
    console.log("Current samples:")
    console.log(samples)
    var samples2 = {
      ...samples
    };

    for (let f of event.target.files) {
      console.log(f)
      if (f['type'] === 'application/json') {
        console.log(f['name'] + " seems to be a JSON file.")
        const text = await readFile(f, samples2)
        const data = await JSON.parse(text)
        console.log("Data:")
        console.log(data)
        const sampleId = data["sample"]["summary"]["sample"]
        samples2[sampleId] = data
        }
      }

    setSamples(samples2)
    }

    function readFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
    
        reader.onload = res => {
          resolve(res.target.result);
        };
        reader.onerror = err => reject(err);
    
        reader.readAsText(file);
      });
    }

	return(
   <div className="pane">
			<input type="file" name="file" multiple onChange={changeHandler} />
		</div>
	)

}

function DummyView(props){
  const [samples, setSamples] = useRecoilState(sampleState);

  const listItems = Object.entries(samples).map(([key, value]) =>
    // Pretty straightforward - use key for the key and value for the value.
    // Just to clarify: unlike object destructuring, the parameter names don't matter here.
    <li key={key}>
      {key}
    </li>
    )

  return(
     <div className="pane">
        <header>
        <p>{props.title}</p>
        </header>
        <ul>
          {listItems}
        </ul>
     </div>
  );
}

function DataView(props){
  const [samples, setSamples] = useRecoilState(sampleState);

  return(
     <div className="pane">
        <header>
          <p>Data</p>
        </header>
        <ReactJson src={samples}/>
     </div>
  );
}

function App() {
  return (
    <RecoilRoot>
      <div className="App">
        <div className="row">
          <div className="column">
            <FileUploader />
          </div>
          <div className="column">
              <DummyView title="Map"/>
          </div>
          <div className="column">
              <DummyView title="Tree"/>
          </div>
        </div>
        <div className = "row">
          <div className="column">
              <DummyView title="Epi"/>
          </div>
        </div>
        <div className = "row">
          <div className="column">
              <DataView/>
          </div>
        </div>
    </div>
  </RecoilRoot>
  );
}
