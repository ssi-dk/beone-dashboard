// import logo from './logo.svg';
import React from 'react';

import {
  RecoilRoot,
} from 'recoil'

import './App.css'
import TableView from './TableView'
import DataSources from './DataSources'
import Phylo from './Phylo'

export default App;

function App() {
  return (
    <RecoilRoot>
      <div className='App'>
        <div className='row'>
          <div className='column'>
              <TableView/>
          </div>
          <div className='column'>
              <Phylo/>
          </div>
        </div>
        <div className = 'row'>
          <DataSources/>
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
