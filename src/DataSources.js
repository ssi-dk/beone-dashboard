import React, { useState, useMemo, useEffect } from 'react'

import {
  atom,
  useRecoilState,
} from 'recoil'

import { sampleState, columnDataState, columnUserdataState } from './RecoilStates'
import FieldEditor from './FieldEditor'
import { readFile } from './utils'
const jp = require('jsonpath')

export default DataSources

function DataSources() {

  // samples is a global state that holds a minimum of information about the samples.
  const [samples, setSamples] = useRecoilState(sampleState);
  // allData is a local state that holds all the JSON data (all data are not neededs globally).
  const [allData, setAllData] = useState(new Map());

  const [columnData, setColumnData] = useRecoilState(columnDataState);
  const [columnUserdata, setColumnUserdata] = useRecoilState(columnUserdataState);

  function validateColumnLength(samples, columnData) {
    for (let i = 0; i < columnData.length; i++) {
      if (columnData[i].length < samples.size) {
        return false
      }
    }
    return true
  }

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
        const sampleId = data['sample']['summary']['sample']
        if (samplesCopy.has(sampleId)) {
          alert(f.name + ' was not imported as it would overwrite existing sample ID ' + sampleId)
        } else {
          samplesCopy.set(sampleId, {
            inTree: false,  // The tree should tell wether it knows the sample or not.
            selected: false
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

  return (
    <div className='pane'>
      <div className='pane'>
        <h1>Data Sources</h1>
        <div className='vspace'>
          <label>
            <span className='label'>Select local JSON file(s):</span>
            <input type='file' name='file' multiple onChange={JSONChangeHandler} />
          </label>
        </div>
      </div>
      <div className='pane'>
        <FieldEditor data={allDataArray} />
      </div>
    </div>
  )

}