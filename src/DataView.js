
import {React, useState } from 'react'
import {atom, useRecoilState} from 'recoil'
import ReactJson from 'react-json-view'
export default DataView

/* const columnDataState = atom({
  key: 'columnDataState',
  default: new Array(),
}); */

const columnMetadataState = atom({
  key: 'columnMetadataState',
  default: new Array(),
});

function DataView(props) {
  const [selectedFields, setSelectedFields] = useState([]);
  // const [columnData, setColumnData] = useRecoilState(columnDataState);
  const [columnMetadata, setColumnMetadata] = useRecoilState(columnMetadataState);

  const fieldSelectHandler = (selection) => {
    // The values are also of interest.
    console.log(selection.value)
    var jsonPath = selection.namespace.join('.')
    jsonPath = jsonPath + '.' + selection.name
    if (!selectedFields.includes(jsonPath)) {
      var selectedFieldsCopy = Array.from(selectedFields)
      selectedFieldsCopy.push(jsonPath)
      setSelectedFields(selectedFieldsCopy)
      var columnMetadataCopy = Array.from(columnMetadata)
      const columnMetadataElement = {'columnId': jsonPath}
      columnMetadataCopy.push(columnMetadataElement)
      setColumnMetadata(columnMetadataCopy)
    }
  }

  const fieldDeselectHandler = (event) => {
    if (selectedFields.includes(event.target.name)) {
      var selectedFieldsCopy = Array.from(selectedFields)
      selectedFieldsCopy.splice(selectedFieldsCopy.indexOf(event.target.name), 1)
      setSelectedFields(selectedFieldsCopy)
      var columnMetadataCopy = Array.from(columnMetadata)
      const columnMetadataElement = columnMetadataCopy.find(element => element['columnId']===event.target.name)
      columnMetadataCopy.splice(columnMetadataCopy.indexOf(columnMetadataElement), 1)
      setColumnMetadata(columnMetadataCopy)
    }
  }
  
  const fieldItems = selectedFields.map((path) =>
    <button className='selected-field' key={path} name={path} onClick={fieldDeselectHandler}>
      {path}
    </button>
  )

  const jsonView = props.data.map(([key, value]) =>
    <div className='data-row' key={key}>
      <div>{key}</div>
      <ReactJson src={value} collapsed='true' onSelect={fieldSelectHandler}/>
    </div>
  )

  return(
    <div>
      <div className='row'>
        <label>
        <span className='rspace'>Selected fields:</span>
          {fieldItems}
        </label>
      </div>
      <div>
        {jsonView}
      </div>
    </div>
    );
  }