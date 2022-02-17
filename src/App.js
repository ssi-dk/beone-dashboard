// import logo from './logo.svg';
import React, { Component, useState } from 'react';

import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil'

import Phylo from './Phylo'

import './App.css';
import FileUploader from './FileUploader';
import DataView from './DataView';

export default App;

const sampleState = atom({
  key: 'sampleState',
  default: {},
});

const newickState = atom({
  key: 'newickState',
  default: '()',
});

function DummyView(props){
  const [samples, setSamples] = useRecoilState(sampleState);

  const rowItems = Object.entries(samples).map(([key, value]) =>
    <div className="row" key={key}>
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

          <div className="pane">
            <h1>
              Tree
            </h1>
            <Phylo/>
          </div>
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
