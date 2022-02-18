import React from 'react'
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil'
import PhylocanvasGL, { TreeTypes } from "@phylocanvas/phylocanvas.gl";

const newickState = atom({
  key: 'newickState',
  default: '()',
});

const sampleState = atom({
  key: 'sampleState',
  default: {},
});

class PhyloClass extends React.Component {

    static displayName = "Phylocanvas"
  
    canvasRef = React.createRef()
  
    componentDidMount() {
      this.tree = new PhylocanvasGL(
        this.canvasRef.current,
        this.props || {},
      );
    }

    componentDidUpdate() {
      var props = {
        ...this.props
      }
      /* A couple of examples of how to work with graphics on individual nodes */
      props['styles'] = {'Se-Germany-BfR-0001': {fillColour: "lightgray" }}
      props['selectedIds']=['Se-Germany-BfR-0010']
      this.tree.setProps(props);

      console.log(this.tree.findNodeById('Se-Germany-BfR-0001'))
      console.log(this.tree.exportJSON())
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

  function Phylo(){
    const [newick, setNewick] = useRecoilState(newickState);
    const [samples, setSamples] = useRecoilState(sampleState);
   
    return(
      <div className="pane">
      <h1>
        Tree
      </h1>
        <PhyloClass
          source={newick}
          metadata={samples}
          size={{ width: window.innerWidth / 2, height: 400 }}
          showLabels
          showLeafLabels
          interactive
        />
      </div>
    )
  }
 
  export default Phylo