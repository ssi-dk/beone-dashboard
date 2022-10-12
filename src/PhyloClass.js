import React from 'react'
import PhylocanvasGL from '@phylocanvas/phylocanvas.gl'
import PubSub from 'pubsub-js'

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

export default PhyloClass
  