import React, { useState, useMemo } from 'react'

import {
  atom,
  useRecoilState,
} from 'recoil'

import FieldEditor from './FieldEditor'
import { readFile } from './utils'

export default DataSources

const sampleState = atom({
  key: 'sampleState',
  default: new Map(),
});

function DataSources() {

  // samples is a global state that holds a minimum of information about the samples.
  const [samples, setSamples] = useRecoilState(sampleState);
  // allData is a local state that holds all the JSON data (all data are not neededs globally).
  const [allData, setAllData] = useState(new Map());

  const JSONChangeHandler = async (event) => {

    // Make deep copies of states
    var samplesCopy = new Map(JSON.parse(
      JSON.stringify(Array.from(samples))
    ));
    var allDataCopy = new Map(JSON.parse(
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