import React, { useEffect, useMemo } from 'react'
import { atom, useRecoilState } from 'recoil'

import parser from 'biojs-io-newick'
import PubSub from 'pubsub-js'

import { findValues } from './utils'
import treeIcon from './icons/icons8-tree-20.png'

export default Overview

const sampleState = atom({
  key: 'sampleState',
  default: new Map(),
});

const newickState = atom({
  key: 'newickState',
  default: '()',
});

const columnMetadataState = atom({
  key: 'columnMetadataState',
  default: new Array(),
});

const columnDataState = atom({
  key: 'columnDataState',
  default: new Array(),
});

function Overview() {
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
      let columnsInRow = Array()
      for (let columnNumber = 0; columnNumber < columnData.length; columnNumber++) {
        const field = columnData[columnNumber][rowNumber]
        columnsInRow.push(field)
      }
      const id = sampleArray[rowNumber][0]
      dataRows.set(id, columnsInRow)
    }
    return dataRows
  }

  const columnDataAsRows = useMemo(() => getColumnDataAsRows(sampleArray, columnData), [sampleArray, columnData])

  const getDataItemsForId = (id) => {
    const dataFields = columnDataAsRows.get(id)
    return dataFields.map((field, index) => 
    <div className='overview-datacolumn' key={index}>
      {field}
    </div>
    )
  }

  const rowItems = sampleArray.map(([id, value]) =>
    <div key={id} className='row'>
      <div className='overview-column'>
        <ShowTreeIcon inTree={value.inTree} />
      </div>
      <div className='overview-column'>
        <input type='checkbox' name={id} checked={value['selected']} onChange={handleOnSelectedChange} />
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
    <div className='overview-header' key={element['columnId']}>{getHeaderTitleFromId(element['columnId'])}</div>)

  return (
    <div className='pane'>
      <h1>Overview</h1>
      <div className='overview-row'>
        <div className='overview-column'>&nbsp;</div>
        <div className='overview-firstcol'><input type='checkbox'></input></div>
        <div className='overview-header'>ID</div>
        {dataColumnHeaders}
      </div>
      {rowItems}
    </div>
  );
}