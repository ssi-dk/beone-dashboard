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
      this.tree.setProps(this.props);
      console.log(this.tree.findNodeById('Se-Germany-BfR-0001'))
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
      <div>
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