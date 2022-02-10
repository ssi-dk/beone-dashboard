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
    var samples2 = {
      ...samples
    };

    for (let f of event.target.files) {
      if (f['type'] === 'application/json') {
        console.log(f['name'] + " seems to be a JSON file.")
        const text = await readFile(f, samples2)
        const data = await JSON.parse(text)
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
      <h1>
        <div>Files</div>
      </h1>
			<input type="file" name="file" multiple onChange={changeHandler} />
		</div>
	)

}

function DummyView(props){
  const [samples, setSamples] = useRecoilState(sampleState);

  const rowItems = Object.entries(samples).map(([key, value]) =>
    <div class="row" key={key}>
      {key}
    </div>
    )

  return(
     <div className="pane">
        <h1>
        <div>{props.title}</div>
        </h1>
        {rowItems}
     </div>
  );
}

function DataView(props){
  const [samples, setSamples] = useRecoilState(sampleState);
  
  const rowItems = Object.entries(samples).map(([key, value]) =>
  <div class="row" key={key}>
    <div class="column">
      {key}
    </div>
    <div class="column">
      <ReactJson src={value["sample"]} name="sample" collapsed="true"/>
    </div>
    <div class="column">
      <ReactJson src={value["pipelines"]} name="pipelines" collapsed="true"/>
    </div>
  </div>
  )

  return(
     <div className="pane">
      <div class="row row-header">
        <div class="column">
          <h1>
            Data
          </h1>
        </div>
        <div class="column">
          <h2>
            Sample
          </h2>
        </div>
        <div class="column">
          <h2>
            Pipelines
          </h2>
        </div>
      </div>
        {rowItems}
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
