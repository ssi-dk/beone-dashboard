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
  
    return(
      <div>
        <PhyloClass
          source={newick}
          size={{ width: 900, height: 400 }}
          showLabels
          showLeafLabels
          interactive
        />
      </div>
    )
  }
 
  export default Phylo