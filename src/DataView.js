
import ReactJson from 'react-json-view'
import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
  } from 'recoil'
export default DataView

const sampleState = atom({
    key: 'sampleState',
    default: {},
  });

function DataView(props){
    const [samples, setSamples] = useRecoilState(sampleState);
    
    const rowItems = Object.entries(samples).map(([key, value]) =>
    <div className="data-row" key={key}>
      <div className="column">
        Sample ID: {key}
      </div>
      <div className="column">
        <ReactJson src={value["sample"]} name="sample" collapsed="true"/>
      </div>
      <div className="column">
        <ReactJson src={value["pipelines"]} name="pipelines" collapsed="true"/>
      </div>
    </div>
    )
  
    return(
       <div className="pane">
        <div className="row row-header">
          <div className="column">
            <h1>
              Data
            </h1>
          </div>
          <div className="column">
            <h2>
              Sample
            </h2>
          </div>
          <div className="column">
            <h2>
              Pipelines
            </h2>
          </div>
        </div>
          {rowItems}
       </div>
    );
  }