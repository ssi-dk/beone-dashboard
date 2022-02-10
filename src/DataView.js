
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
    <div class="data-row" key={key}>
      <div class="column">
        Sample ID: {key}
      </div>
      <div class="column">
        <ReactJson src={value["sample"]} name="sample" collapsed="true"/>
      </div>
      <div class="column">
        <ReactJson src={value["pipelines"]} name="pipelines" collapsed="true"/>
      </div>
    </div>
    )
  
    return(
       <div className="pane">
        <div class="row row-header">
          <div class="column">
            <h1>
              Data
            </h1>
          </div>
          <div class="column">
            <h2>
              Sample
            </h2>
          </div>
          <div class="column">
            <h2>
              Pipelines
            </h2>
          </div>
        </div>
          {rowItems}
       </div>
    );
  }