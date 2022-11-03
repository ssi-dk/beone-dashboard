import React, { useState, useMemo, useEffect } from 'react'

import {
  atom,
  useRecoilState,
} from 'recoil'

import { sampleState, columnDataState, columnUserdataState, clusterState } from './RecoilStates'
import FieldEditor from './FieldEditor'
import { readFile } from './utils'
const jp = require('jsonpath')

export default DataSources

function DataSources(props) {

  // samples is a global state that holds a minimum of information about the samples.
  const [samples, setSamples] = useRecoilState(sampleState);
  // allData is a local state that holds all the JSON data (all data are not neededs globally).
  const [allData, setAllData] = useState(new Map());

  const [columnData, setColumnData] = useRecoilState(columnDataState);
  const [columnUserdata, setColumnUserdata] = useRecoilState(columnUserdataState);
  const [clusters, setClusters] = useRecoilState(clusterState);

  function validateColumnLength(samples, columnData) {
    for (let i = 0; i < columnData.length; i++) {
      if (columnData[i].length < samples.size) {
        return false
      }
    }
    return true
  }

  useMemo(async () => {
    const url = '/rt_jobs/' + props.rtJob + '/partitions/';
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
      }
    };
    fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        setClusters(data);
      });
  }, [props.rtJob]);


  // Check column sizes
  const columnsOK = useMemo(() => validateColumnLength(samples, columnData), [samples, columnData])

  useEffect(() => {
    if (!columnsOK) {
      let newColumnData = Array()
      for (let colMeta of columnUserdata) {
        let column = Array()
        for (const entry of allData) {
          const columnDataForSample = jp.value(entry[1], colMeta['columnId'])
          column.push(columnDataForSample)
        }
        newColumnData.push(column)
      }
      setColumnData(newColumnData)
    }
  });


  const JSONChangeHandler = async (event) => {

    // Make deep copies of states
    let samplesCopy = new Map(JSON.parse(
      JSON.stringify(Array.from(samples))
    ));
    let allDataCopy = new Map(JSON.parse(
      JSON.stringify(Array.from(allData))
    ));

    for (let f of event.target.files) {
      if (f['name'].endsWith('.json')) {
        const text = await readFile(f)
        const data = await JSON.parse(text)
        let sampleId
        if ('sample' in data && 'summary' in data.sample && 'sample' in data.sample.summary) {
          sampleId = data.sample.summary.sample
          // Assuming BeONE data structure for sample.
        }
        if ('name' in data) {
          sampleId = data.name
          // Assuming Bifrost data structure for sample.
        }
        if (samplesCopy.has(sampleId)) {
          alert(f.name + ' was not imported as it would overwrite existing sample ID ' + sampleId)
        } else {
          samplesCopy.set(sampleId, {
            inTree: false,  // The tree should tell wether it knows the sample or not.
            selected: false,
            latitude: data.sample.metadata.Latitude,
            longitude: data.sample.metadata.Longitude,
            // clusters: [] Just an idea for the future
          })
          data['source'] = 'file:///' + f.name
          allDataCopy.set(sampleId, data)
        }
      }
      else {
        alert('Filename must end with ".json".')
      }
    }
    setSamples(samplesCopy)
    setAllData(allDataCopy)
  }

  let allDataArray = useMemo(() => Array.from(allData), [allData])

  let dataSourceOptions = useMemo(() => {
    if (props.rtJob && clusters.length!==0) {
      console.log(clusters)
      return(
        <div>
          <h1>ReporTree clusters</h1>
          <div> Select distance threshold:</div>
          <div className='row'>
          <select className='column rspace'>
          {Object.keys(clusters['partitions']).map(element => <option key={element} value={element}>{element}</option>)}
          </select>
          <button className='column'>Add clusters</button>
          </div>
        </div>
      )
    } else {
      return(
        <label>
          <span className='label'>Select local JSON file(s):</span>
          <input type='file' name='file' multiple onChange={JSONChangeHandler} />
        </label>
      )
    }
  }, [clusters])

  return (
    <div>
      <div className='row'>
        <div className='pane column'>
          {dataSourceOptions}
        </div>
        <div className='pane column'>
          <FieldEditor data={allDataArray} />
        </div>
      </div>
    </div>
  )

}