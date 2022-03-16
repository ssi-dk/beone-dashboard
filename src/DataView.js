
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
    default: new Map(),
  });

function DataView(props){
    const rowItems = props.data.map(([key, value]) =>
    <div className="data-row" key={key}>
      <div className="column">
        {key}
      </div>
      <div className="column">
        <ReactJson src={value["sample"]["summary"]} name="summary" collapsed="true"/>
      </div>
      <div className="column">
        <ReactJson src={value["sample"]["qc_assessment"]} name="qc" collapsed="true"/>
      </div>
      <div className="column">
        <ReactJson src={value["sample"]["metadata"]} name="sample_meta" collapsed="true"/>
      </div>
      <div className="column">
        <ReactJson src={value["sample"]["run_metadata"]} name="run_meta" collapsed="true"/>
      </div>
      <div className="column">
        <ReactJson src={value["pipelines"]} name="pipeline" collapsed="true"/>
      </div>
    </div>
    )
  
    return(
       <div>
        <h1>Data</h1>
        <div className="row row-header">
          <div className="column">
            <h2>
              Sample ID
            </h2>
          </div>
          <div className="column">
            <h2>
              Summary
            </h2>
          </div>
          <div className="column">
            <h2>
              QC assessment
            </h2>
          </div>
          <div className="column">
            <h2>
              Sample metadata
            </h2>
          </div>
          <div className="column">
            <h2>
              Run metadata
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