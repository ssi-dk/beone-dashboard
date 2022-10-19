// import logo from './logo.svg';
import React, { useEffect } from 'react'

import { useRecoilState } from 'recoil'

import { sampleState, newickState } from './RecoilStates'
import './App.css'
import TableView from './TableView'
import DataSources from './DataSources'
import Phylo from './Phylo'
import Geo from './Geo'

export default DashboardComponent;

function DashboardComponent(props) {
  const [samples, setSamples] = useRecoilState(sampleState);
  const [newick, setNewick] = useRecoilState(newickState);

  useEffect(async () => {
    const url = "/rt_jobs/1/data/";
    const options = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      }
    };
    fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        let fetchedSamples = new Map()
        for (let entry of data.sample_ids) {
          let fullName = entry.org + '.' + entry.name
          fetchedSamples.set(fullName, {'inTree': false, 'selected': false, 'latitude': false, 'longitude': false})
        }
        console.log(fetchedSamples)
        setSamples(fetchedSamples);
        //setNewick(data.newick);
      });

    //setData(result.data);
  });

  return (
    <div className='row'>
      <div className='column'>
          <TableView/>
      </div>
      <div className='column'>
          <Phylo rtJob={props.rtJob}/>
      </div>
    </div>
);
}
