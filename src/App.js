// import logo from './logo.svg';
import React from 'react';

import {
  RecoilRoot,
} from 'recoil'

import './App.css'
import TableView from './TableView'
import DataSources from './DataSources'
import Phylo from './Phylo'
import Geo from './Geo'

export default App;

function App() {
  return (
    <RecoilRoot>
      <div className='App'>
        <div className='baseline-row pane'>
          <div className='column'>
            <h1>BeONE Dashboard</h1>
          </div>
          <div className='right-justify'>
            <div>Version 0.2</div>
          </div>
        </div>
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
            <Geo/>
          </div>
      </div>
    </div>
  </RecoilRoot>
  );
}
