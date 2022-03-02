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
    console.log("Tree IDs:")
    console.log(treeIds)

    const sampleArray = Array.from(samples)
    const rowItems = sampleArray.map(([key, value]) =>
      <div key={key}>
        <div className='row'>
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
          <input type="checkbox" disabled={true} checked={value['selected']}/>
          </div>
          <div className='column'>
            {value.clusters}
          </div>
        </div>
      </div>)
    return(
       <div className="pane">
          <h1>Overview</h1>
          <div className='row'>
            <div className='column'>Sample ID</div>
            <div className='column'>Source</div>
            <div className='column'>In tree</div>
            <div className='column'>Selected</div>
            <div className='column'>Clusters</div>
          </div>
          {rowItems}
       </div>
    );
  }