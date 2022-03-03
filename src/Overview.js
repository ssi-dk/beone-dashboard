import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
  } from 'recoil'

import parser from "biojs-io-newick"

import {findValues} from './utils'

export default Overview

const sampleState = atom({
    key: 'sampleState',
    default: new Map(),
  });
  
  const newickState = atom({
    key: 'newickState',
    default: '()',
  });

function Overview(props){
    const [samples, setSamples] = useRecoilState(sampleState);
    const [newick, setNewick] = useRecoilState(newickState);

    const treeAsJSON = parser.parse_newick(newick)
    const treeIds = findValues(treeAsJSON, 'name')
    
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

    const sampleArray = Array.from(samples)
    const rowItems = sampleArray.map(([key, value]) =>
      <div key={key}className='data-row'>
        <div className='column'>
          {key}
        </div>
        <div className='column'>
          {value.source}
        </div>
        <div className='column'>
          <input type="checkbox" disabled={true} checked={treeIds.includes(key)}/>
        </div>
        <div className='column'>
        <input type="checkbox" name={key} checked={value['selected']} onChange={handleOnSelectedChange}/>
        </div>
        <div className='column'>
          {value.clusters}
        </div>
      </div>
    )
    return(
       <div className="pane">
          <h1>Overview</h1>
          <div className='row row-header'>
            <div className='column'><h2>Sample ID</h2></div>
            <div className='column'><h2>Source</h2></div>
            <div className='column'><h2>In tree</h2></div>
            <div className='column'><h2>Selected</h2></div>
            <div className='column'><h2>Clusters</h2></div>
          </div>
          {rowItems}
       </div>
    );
  }