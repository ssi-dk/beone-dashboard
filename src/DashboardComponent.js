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

function DashboardComponent(props) {
  return (
    <RecoilRoot>
      <div className='pane'>
        <h2>Dashboard Launcher</h2>
        <div className='margin-tb'>
          <button>Load ReporTree job {props.rtJob} into dashboard</button>  
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
        <div className='column'>
          <DataSources rtJob={props.rtJob}/>
        </div>
        <div className='column'>
          <Geo/>
        </div>
      </div>
  </RecoilRoot>
  );
}
