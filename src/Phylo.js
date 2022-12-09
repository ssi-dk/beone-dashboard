import React, { useMemo } from 'react'
import {
  atom,
  useRecoilState,
} from 'recoil'
import parser from 'biojs-io-newick'

import { sampleState, newickState } from './RecoilStates'
import {readFile, findValues, getClusterColor} from './utils'
import PhyloClass from './PhyloClass'

export default Phylo

function Phylo() {
  const [newick, setNewick] = useRecoilState(newickState);
  const [samples] = useRecoilState(sampleState);

  const NewickManualHandler = async (event) => {
    // Handle manual upload of a Newick file.
    const f = event.target.files[0]
    if (f['name'].endsWith('.nwk')) {
      const text = await readFile(f)
      setNewick(text)
    }
    else {
      alert('Filename must end with ".nwk".')
    }
  }

  function treeStyles(newick, samples) {
    const treeAsJSON = parser.parse_newick(newick)
    const treeIds = findValues(treeAsJSON, 'name')
    
    let styles = {}
    let realClusterCount = 0

    samples.forEach(function(sample, id) {
      if ('cluster' in sample && sample.cluster.startsWith('cluster_')) {
        styles[id] = {'fillColour': getClusterColor(sample.cluster)}
        realClusterCount++
      }
    });
    console.log(realClusterCount)

    // styles[id] = {fillColour: 'green'}

    for (let id of treeIds) {
      // Make tree nodes lightgray if not in samples
      if (!samples.has(id)) {
        styles[id] = {fillColour: 'lightgray'}
      }
    }
    return styles
  }

  function showFileSelector(newick) {
    if (newick === '()') {
      return(
        <div className='vspace'>
        <label>
          <span className='label'>Select Newick file:</span>
          <input type='file' name='file' onChange={NewickManualHandler} />
        </label>
      </div>
      );
    }
  }

  const styles = useMemo(() =>
    treeStyles(newick, samples),
    [newick, samples]
  )
  
  const selectedSamples = Array.from(samples).filter(sample => sample[1]['selected'])
  const selectedIds = selectedSamples.map(x => x[0])
  const allIds = Array.from(samples).map(x => x[0])

  return (
    <div className='pane'>
      <h1>
        Tree
      </h1>
      {showFileSelector(newick)}
      <PhyloClass
        source={newick}
        metadata={samples}
        size={{ width: window.innerWidth / 2, height: 1000 }}
        showLabels
        showLeafLabels
        interactive
        styles={styles}
        selectedIds={selectedIds}
        allIds={allIds}
      />
    </div>
  )
}