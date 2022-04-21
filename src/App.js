// import logo from './logo.svg';
import React from 'react';

import {
  RecoilRoot,
} from 'recoil'

import './App.css'
import Overview from './Overview'
import DataSources from './DataSources'
import Phylo from './Phylo'

export default App;

function App() {
  return (
    <RecoilRoot>
      <div className='App'>
        <div className='row'>
          <div className='column'>
              <Overview/>
          </div>
          <div className='column'>
              <Phylo/>
          </div>
        </div>
        <div className = 'row'>
          <div className='column'>
              <DataSources/>
          </div>
          <div className='column'>
            <div className='pane'>
              <h1>Map</h1>
            </div>
          </div>
      </div>
    </div>
  </RecoilRoot>
  );
}
