// import logo from './logo.svg';
import React from 'react';

import {
  RecoilRoot,
} from 'recoil'

import './App.css'
import Overview from './Overview'
import DataFiles from './DataFiles'
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
              <DataFiles/>
          </div>
      </div>
    </div>
  </RecoilRoot>
  );
}
