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

function Overview() {
  const [samples, setSamples] = useRecoilState(sampleState);
  const [newick] = useRecoilState(newickState);

  useEffect(() => {
    var selectionSubscriber = function (msg, sampleID) {
      if (samples) {
        console.log('Received ID ' + sampleID)
        var samplesCopy = new Map(JSON.parse(
          JSON.stringify(Array.from(samples))
        ));
        console.log('samplesCopy:')
        console.log(samplesCopy)
        var sample = samplesCopy.get(sampleID)
        if (sample) {
          sample['selected'] = !sample['selected']
          samplesCopy.set(sampleID, sample)
          setSamples(samplesCopy)
        }
      }
    }
    const subscription = PubSub.subscribe('SELECT', selectionSubscriber)
    return () => {
      console.log('Unsubscribing.')
      PubSub.unsubscribe(subscription)
    }
  }, [samples])

  const handleOnSelectedChange = (event) => {
    const sampleID = event.target.name
    var samplesCopy = new Map(JSON.parse(
      JSON.stringify(Array.from(samples))
    ));
    var sample = samplesCopy.get(sampleID)
    sample['selected'] = !samples.get(sampleID)['selected']
    samplesCopy.set(sampleID, sample)
    setSamples(samplesCopy)
  }

  function getSampleArray(samples) {
    const treeAsJSON = parser.parse_newick(newick)
    const treeIds = findValues(treeAsJSON, 'name')
    const sampleArray = Array.from(samples)
    for (var sample of sampleArray) {
      sample[1]['inTree'] = treeIds.includes(sample[0])
    }
    return sampleArray
  }
  const sampleArray = useMemo(() => getSampleArray(samples), [samples])

  function ShowTreeIcon(props) {
    const inTree = props.inTree;
    if (inTree) { return <img src={treeIcon} /> } return <div />;
  }

  const rowItems = sampleArray.map(([key, value]) =>
    <div key={key} className='row'>
      <div className='overview-column'>
        <ShowTreeIcon inTree={value.inTree} />
      </div>
      <div className='overview-column'>
        <input type='checkbox' name={key} checked={value['selected']} onChange={handleOnSelectedChange} />
      </div>
      <div className='overview-datacolumn'>
        {key}
      </div>
    </div>
  )

  return (
    <div className='pane'>
      <h1>Overview</h1>
      <div className='overview-row'>
        <div className='overview-column'>&nbsp;</div>
        <div className='overview-column'><input type='checkbox'></input></div>
        <div className='overview-datacolumn'><h2>ID</h2></div>
      </div>
      {rowItems}
    </div>
  );
}