import React, { useMemo } from 'react'
import {
  atom,
  useRecoilState,
} from 'recoil'
import parser from 'biojs-io-newick'

import { sampleState, newickState } from './RecoilStates'
import {readFile, findValues} from './utils'
import PhyloClass from './PhyloClass'

export default Phylo

function Phylo(props) {
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
      
  const NewickPropHandler = async () => {
    // Fetch Newick file via props 
    if (props.rtJob) {
      setNewick('((Se-Germany-BfR-0001:1,Se-Germany-BfR-0002:2,Se-Germany-BfR-0003:3,Se-Germany-BfR-0004:4):5,(Se-Germany-BfR-0005:5,Se-Germany-BfR-0006:6):3,(Se-Germany-BfR-0007:7,Se-Germany-BfR-0008:8,Se-Germany-BfR-0009:9,Se-Germany-BfR-0010:10,Not-in-data:5):11);')
    }
  }

  function treeStyles(newick, samples) {
    /* In the future there may be a way of getting the tree IDs directly from
    the tree. A getLeafIds() method seems to be planned, but is not
    implemented at the time of this writing. See
    https://www.phylocanvas.gl/docs/methods.html#getleafids */
    const treeAsJSON = parser.parse_newick(newick)
    const treeIds = findValues(treeAsJSON, 'name')

    let styles = {}
    for (let id of treeIds) {
      if (!samples.has(id)) {
        styles[id] = {fillColour: 'lightgray'}
      }
    }
    return styles
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
      <div className='vspace'>
          <button onClick={NewickPropHandler}>Load tree from ReporTree job {props.rtJob}</button>  
        </div>
      <div className='vspace'>
        <label>
          <span className='label'>Select Newick file:</span>
          <input type='file' name='file' onChange={NewickManualHandler} />
        </label>
      </div>
      <PhyloClass
        source={newick}
        metadata={samples}
        size={{ width: window.innerWidth / 2, height: 400 }}
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