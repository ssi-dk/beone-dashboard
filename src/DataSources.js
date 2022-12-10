import React, { useState, useMemo, useEffect } from 'react'

import {
  atom,
  useRecoilState,
} from 'recoil'

import { sampleState, columnDataState, columnMetadataState, clusterState } from './RecoilStates'
import FieldEditor from './FieldEditor'
import { readFile } from './utils'
const jp = require('jsonpath')

export default DataSources

function DataSources(props) {

  // samples is a global state that holds a minimum of information about the samples.
  const [samples, setSamples] = useRecoilState(sampleState);

  // allData is a local state that holds all the JSON data (all data are not neededs globally).
  const [allData, setAllData] = useState(new Map());

  // This is a local state that holds the last selected value from the partition select.
  const [selectedPartion, setSelectedPartition] = useState(new String())

  const [columnData, setColumnData] = useRecoilState(columnDataState);
  const [columnMetadata, setColumnMetadata] = useRecoilState(columnMetadataState);
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
        // console.log("data:")
        // console.log(data)
        setClusters(data);
      });
  }, [props.rtJob]);


  // Check column sizes
  const columnsOK = useMemo(() => validateColumnLength(samples, columnData), [samples, columnData])

  useEffect(() => {
    if (!columnsOK) {
      let newColumnData = Array()
      for (let colMeta of columnMetadata) {
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

  const partitionSelectHandler = (e) => {
    // Copied from Fieldeditor.fieldSelectHandler - maybe merge some parts?
    if (selectedPartion.length > 0) {
    // console.log('We want to add clusters from ' + selectedPartion)
    // console.log('Here we have the clusters within the selected partition:')
    // console.log(clusters.partitions[selectedPartion])
    let partitionWithData = clusters.partitions[selectedPartion]
    for (let cluster of partitionWithData) {
      // console.log('Cluster ' + cluster.name + ' contains these samples:')
      // console.log(cluster.samples)
    }
       let columnDataCopy = Array.from(columnData)

      // Build an array with column data from all samples
      let column = Array()
      let samplesCopy = new Map(JSON.parse(
        JSON.stringify(Array.from(samples))
      ));

      // minVal and maxVal are in this case the lowest and highest cluster number.
      // If no clusters are found, both values will be 0.
      // let minVal = 0 
      // let maxVal = 0
      let clusterNumber
      samplesCopy.forEach(function(sample, id) {
        
        // Find the cluster name in which the sample name exists
        for (let cluster of partitionWithData) {
          let orgAndName
          let found = false
          for (let clusterSample of cluster.samples) {
            if (found) {
              break
            }
            orgAndName = clusterSample.org + '.' + clusterSample.name
            if (orgAndName === id) {
              // console.log('Yup, found it: ' + clusterSample.name)
              // alert('Yup, found it: ' + clusterSample.name)
              column.push(cluster.name)
              sample = samplesCopy.get(id)
              sample['cluster'] = cluster.name
              samplesCopy.set(id, sample)
              found = true
              // clusterNumber = parseInt(cluster.name.substring(cluster.name.indexOf('_') + 1))
              // minVal = 1
              // if (clusterNumber > maxVal) { maxVal = clusterNumber }
              break
            }
            // console.log("No, it was not in " + clusterSample.name + '.')
          }
        }
      });
      // Add column to columnData
      columnDataCopy.unshift(column)
      setColumnData(columnDataCopy)
      // Update samples
      setSamples(samplesCopy)

      // Add header to columnMetadata
      let columnMetadataCopy = Array.from(columnMetadata)

      // First, check if we already have a Cluster column (this will always be the first column)
      if (columnMetadataCopy.length > 0 && columnMetadataCopy[0].columnId === 'Cluster') {
        // console.log('We already had a Cluster column.')
        columnMetadataCopy.shift()
        columnDataCopy.shift()
    }
    const clusterMetadata = {
      'columnId': 'Cluster',
      'filter': '',
      // 'minVal': minVal,
      // 'maxVal': maxVal
    }
    console.log(clusterMetadata)
    columnMetadataCopy.unshift(clusterMetadata)
    setColumnMetadata(columnMetadataCopy)
    }
  }

  let dataSourceOptions = useMemo(() => {
    if (props.rtJob && clusters.length!==0) {
      return(
        <div>
          <h1>ReporTree clusters</h1>
          <div> Select distance threshold:</div>
          <div className='row'>
          <select className='column rspace'
            onChange={e => {
                      setSelectedPartition(e.target.value)
                  }}
            onFocus={e => {
              setSelectedPartition(e.target.value)
          }}
          >
          {Object.keys(clusters['partitions']).map(element => <option key={element} value={element}>{element}</option>)}
          </select>
          <button className='column' onClick={partitionSelectHandler}>Add clusters</button>
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
  }, [clusters, selectedPartion])

  return (
    <div>
      <div className='row2'>
        <div className='pane column'>
          {dataSourceOptions}
        </div>
        <div className='pane column2'>
          <FieldEditor data={allDataArray} />
        </div>
      </div>
    </div>
  )

}