
import { useState } from 'react'
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

  const [selectedFields, setSelectedFields] = useState([]);
  const [synced, setSynced] = useState(false);

  const transferCheckHandler = (checked) => {
    setSynced(!synced)
  }

  const fieldSelectHandler = (selection) => {
    var jsonPath = selection.namespace.join('.')
    jsonPath = jsonPath + '.' + selection.name
    if (!selectedFields.includes(jsonPath)) {
      var selectedFieldsCopy = Array.from(selectedFields)
      selectedFieldsCopy.push(jsonPath)
      setSelectedFields(selectedFieldsCopy)
      setSynced(false)
    }
  }

  const fieldDeselectHandler = (event) => {
    console.log('Remove' + event.target.name + 'from selected fields')
    if (selectedFields.includes(event.target.name)) {
      var selectedFieldsCopy = Array.from(selectedFields)
      selectedFieldsCopy.splice(selectedFieldsCopy.indexOf(event.target.name))
      setSelectedFields(selectedFieldsCopy)
      setSynced(false)
    }
  }
  
  const fieldItems = selectedFields.map((path) =>
    <button className='selected-field' key={path} name={path} onClick={fieldDeselectHandler}>
      {path}
    </button>
  )

  const jsonView = props.data.map(([key, value]) =>
    <div className="data-row" key={key}>
      <h2>{key}</h2>
      <ReactJson src={value} collapsed="true" onSelect={fieldSelectHandler}/>
    </div>
  )

  return(
    <div>
      <div className='row'>
        <label>
        <span className='rspace'>Selected fields:</span>
          {fieldItems}
        </label>
        <label>
          <input type='checkbox' name='use_for_mapping' checked={synced} onChange={transferCheckHandler}/>
          <span className='rspace'>Sync to Overview</span>
        </label>
      </div>
      <div>
        {jsonView}
      </div>
    </div>
    );
  }