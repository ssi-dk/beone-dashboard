import React, { useMemo } from 'react'
import {
  atom,
  useRecoilState,
} from 'recoil'
import PhylocanvasGL from '@phylocanvas/phylocanvas.gl'
import parser from 'biojs-io-newick'
import PubSub from 'pubsub-js'

import { sampleState, newickState } from './RecoilStates'
import {readFile, findValues} from './utils'

export default Phylo

class PhyloClass extends React.Component {

  static displayName = 'Phylocanvas'

  canvasRef = React.createRef()

  componentDidMount() {
    this.tree = new PhylocanvasGL(
      this.canvasRef.current,
      { ...this.props } || {},
    );

    this.tree.handleClick = (info, event) => {
      const node = this.tree.pickNodeFromLayer(info);
      if (node && this.props.allIds.includes(node.id)) {
        this.tree.selectNode(
          node,
          event.srcEvent.metaKey || event.srcEvent.ctrlKey,
        );
        if (node) {  // or: if (!node.isNull && node.isLeaf)
          PubSub.publish('SELECT', node.id)
        }
      }
    }
  }

  componentDidUpdate() {
    this.tree.setProps({
      ...this.props,
    });
  }

  componentWillUnmount() {
    this.tree.destroy();
  }

  render() {
    return (
      <div ref={this.canvasRef} />
    );
  }

}

function Phylo() {
  const [newick, setNewick] = useRecoilState(newickState);
  const [samples] = useRecoilState(sampleState);

  const NewickChangeHandler = async (event) => {

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
        <label>
          <span className='label'>Select Newick file:</span>
          <input type='file' name='file' onChange={NewickChangeHandler} />
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