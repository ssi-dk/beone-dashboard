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

export default DashboardComponent;

// Fetch job data asynchronously

function DashboardComponent(props) {
  return (
    <RecoilRoot>
      <div className='row'>
        <div className='column'>
            <TableView/>
        </div>
        <div className='column'>
            <Phylo rtJob={props.rtJob}/>
        </div>
      </div>
  </RecoilRoot>
  );
}
