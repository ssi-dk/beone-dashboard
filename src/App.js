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
import FileUploader from './FileUploader';

export default App;

const sampleState = atom({
  key: 'sampleState',
  default: {},
});

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
