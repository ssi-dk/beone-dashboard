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
      <div className='App'>
        <div className='row'>
          Load ReporTree job #
          {document.getElementById('reportree_job_number').innerHTML}
          into dashboard
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
      </div>
    </div>
  </RecoilRoot>
  );
}
