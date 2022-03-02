// import logo from './logo.svg';
import React, { Component, useState } from 'react';

import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil'

import './App.css'
import Overview from './Overview'
import DataFiles from './DataFiles'
import Phylo from './Phylo'

export default App;

const sampleState = atom({
  key: 'sampleState',
  default: new Map(),
});

const newickState = atom({
  key: 'newickState',
  default: '()',
});

function App() {
  return (
    <RecoilRoot>
      <div className="App">
        <div className="row">
          <div className="column">
              <Overview/>
          </div>
          <div className="column">
              <Phylo/>
          </div>
        </div>
        <div className = "row">
          <div className="column">
              <DataFiles/>
          </div>
      </div>
    </div>
  </RecoilRoot>
  );
}
