import React, { useEffect, useMemo, useState } from 'react'
import { atom, useRecoilState } from 'recoil'

import parser from 'biojs-io-newick'
import PubSub from 'pubsub-js'
import {compile} from 'filtering-query'
import Checkbox from 'react-three-state-checkbox'

import { findValues } from './utils'
import treeIcon from './icons/icons8-tree-20.png'
import funnelIcon from './icons/funnel.png'

export default TableView

import { sampleState, newickState, columnDataState, columnMetadataState } from './RecoilStates'

function TableView() {
  const [samples, setSamples] = useRecoilState(sampleState);
  const [newick] = useRecoilState(newickState);
  const [columnMetadata] = useRecoilState(columnMetadataState);
  const [columnData] = useRecoilState(columnDataState);

  useEffect(() => {
    let selectionSubscriber = function (msg, sampleID) {
      if (samples) {
        let samplesCopy = new Map(JSON.parse(
          JSON.stringify(Array.from(samples))
        ));
        let sample = samplesCopy.get(sampleID)
        if (sample) {
          sample['selected'] = !sample['selected']
          samplesCopy.set(sampleID, sample)
          setSamples(samplesCopy)
        }
      }
    }
    const subscription = PubSub.subscribe('SELECT', selectionSubscriber)
    return () => {
      PubSub.unsubscribe(subscription)
    }
  }, [samples])

  const handleOnSelectedChange = (event) => {
    const sampleID = event.target.name
    let samplesCopy = new Map(JSON.parse(
      JSON.stringify(Array.from(samples))
    ));
    let sample = samplesCopy.get(sampleID)
    sample['selected'] = !samples.get(sampleID)['selected']
    samplesCopy.set(sampleID, sample)
    setSamples(samplesCopy)
  }

  function getSampleArray(samples, newick) {
    const treeAsJSON = parser.parse_newick(newick)
    const treeIds = findValues(treeAsJSON, 'name')
    const sampleArray = Array.from(samples)
    for (let sample of sampleArray) {
      sample[1]['inTree'] = treeIds.includes(sample[0])
    }
    return sampleArray
  }
  const sampleArray = useMemo(() => getSampleArray(samples, newick), [samples, newick])

  function ShowTreeIcon(props) {
    const inTree = props.inTree;
    if (inTree) { return <img src={treeIcon} /> } return <div />;
  }

  const getColumnDataAsRows = (sampleArray, columnData) => {
    let dataRows = new Map()
    for (let rowNumber = 0; rowNumber < sampleArray.length; rowNumber++) {
      let good = true
      let columnsInRow = Array()
      for (let columnNumber = 0; columnNumber < columnData.length; columnNumber++) {
        const fieldValue = columnData[columnNumber][rowNumber]
        const filterExp = 'fieldValue ' + columnMetadata[columnNumber]['filter']
        if (filterExp !== 'fieldValue ') {
          const fn = compile(filterExp);
          good = fn({ fieldValue: fieldValue })
          if (good === false) {
            break
          }
        }
        columnsInRow.push(fieldValue)
      }
      if (!good) {
        continue
      }
      const id = sampleArray[rowNumber][0]
      dataRows.set(id, columnsInRow)
    }
    return dataRows
  }

  const columnDataAsRows = useMemo(() => getColumnDataAsRows(sampleArray, columnData, columnMetadata), [sampleArray, columnData, columnMetadata])

  const getColorForField = (index, value) => {
    // Cluster column is always index 0
    if (index === 0) {
      if (value.startsWith('cluster_')) {
        return 'red'
      }
    }
    return 'black'
  }
  
  const getDataItemsForId = (id) => {
    const dataFields = columnDataAsRows.get(id)
    return dataFields.map((field, index) =>
      <div className='overview-datacolumn' key={index} style={{color: getColorForField(index, field)}}>
        {field}
      </div>
    )
  }

  const rowItems = Array.from(columnDataAsRows).map(([id, value]) =>
    <div key={id} className='row'>
      <div className='overview-column'>
        <ShowTreeIcon inTree={samples.get(id).inTree} />
      </div>
      <div className='overview-firstcol'>
        <input type='checkbox' name={id} checked={samples.get(id).selected} onChange={handleOnSelectedChange} />
      </div>
      <div className='overview-datacolumn'>
        {id}
      </div>
      {getDataItemsForId(id)}
    </div>
  )

  const getHeaderTitleFromId = (headerId) => {
    const parts = headerId.split('.')
    return parts[parts.length - 1]
  }

  const dataColumnHeaders = columnMetadata.map((element) =>
    <div className='overview-header' key={element['columnId']}>
      <div className='overview-header-inner-bold'>{getHeaderTitleFromId(element['columnId'])}</div>
      <div className='overview-header-inner'>
        <span>{element['filter']}</span>
      </div>
    </div>
  )

  const [masterCheckboxState, setMasterCheckboxState] = useState({ checked: false, indeterminate: false})

  const handleMasterCheckboxChange = (event) => {
    let samplesCopy = new Map(JSON.parse(
      JSON.stringify(Array.from(samples))
    ));
    let newChecked = !masterCheckboxState.checked
    for (let sample of samplesCopy) {
      if (newChecked) {
        // In this case we only select the samples that are contained in columnDataAsRows
        if (columnDataAsRows.has(sample[0])) {
          sample[1].selected = newChecked
        }
      } else {
        // In this case we unselect ALL samples
        sample[1].selected = newChecked
      }
    }
    setSamples(samplesCopy)
    setMasterCheckboxState({ checked: newChecked, indeterminate: false })
  }

  useMemo(() => {
    let foundSelected = false
    let foundUnselected = false
    let newInd = false
    for (const sample of samples) {
      if (sample[1].selected) { foundSelected = true } else { foundUnselected = true }
      if (foundSelected && foundUnselected) {
        newInd = true
        break
      }
    }
    setMasterCheckboxState({
      checked: masterCheckboxState.checked,
      indeterminate: newInd
    })
  }, [samples])

  return (
    <div className='pane'>
      <h1>Sample List</h1>
      <div className='overview-row'>
        <div className='overview-column'>&nbsp;</div>
        <div className='overview-firstcol-border'>
          <Checkbox
            checked={masterCheckboxState.checked}
            indeterminate={masterCheckboxState.indeterminate}
            onChange={handleMasterCheckboxChange}
          />
          <img className='funnel' src={funnelIcon} />
        </div>
        <div className='overview-header'>
          <div className='overview-header-inner-bold'>
            ID
          </div>
        </div>
        {dataColumnHeaders}
      </div>
      {rowItems}
    </div>
  );
}