
import {React, useState } from 'react'
import {atom, useRecoilState} from 'recoil'
import ReactJson from 'react-json-view'
const jp = require('jsonpath')

export default DataView

const columnDataState = atom({
  key: 'columnDataState',
  default: new Array(),
});

const columnMetadataState = atom({
  key: 'columnMetadataState',
  default: new Array(),
});

function DataView(props) {
  const [selectedFields, setSelectedFields] = useState([]);
  const [columnData, setColumnData] = useRecoilState(columnDataState);
  const [columnMetadata, setColumnMetadata] = useRecoilState(columnMetadataState);

  const fieldSelectHandler = (selection) => {
    var path = [...selection['namespace']]
    path.push(selection['name'])
    path.unshift('$')
    const pathExpression = jp.stringify(path)
    if (!selectedFields.includes(pathExpression)) {
      // Add field to selectedFields
      var selectedFieldsCopy = Array.from(selectedFields)
      selectedFieldsCopy.push(pathExpression)
      setSelectedFields(selectedFieldsCopy)
      // Add header to columnMetadata
      var columnMetadataCopy = Array.from(columnMetadata)
      const columnMetadataElement = {'columnId': pathExpression}
      columnMetadataCopy.push(columnMetadataElement)
      setColumnMetadata(columnMetadataCopy)
      // Build an array with column data from all samples
      var column = Array()
      for (const entry of props.data) {
        const columnDataForSample = jp.value(entry[1], pathExpression)
        column.push(columnDataForSample)
      }
      // Add column to columnData
      var columnDataCopy = Array.from(columnData)
      columnDataCopy.push(column)
      setColumnData(columnDataCopy)
    }
  }

  const fieldDeselectHandler = (event) => {
    if (selectedFields.includes(event.target.name)) {
      // What is the index number of this column?
      const columnIndexNumber = selectedFields.indexOf(event.target.name)
      console.log('columnIndexNumber:')
      console.log(columnIndexNumber)
      // Remove field from selectedFields
      var selectedFieldsCopy = Array.from(selectedFields)
      selectedFieldsCopy.splice(columnIndexNumber, 1)
      setSelectedFields(selectedFieldsCopy)
      // Remove field from columnMetadata
      var columnMetadataCopy = Array.from(columnMetadata)
      const columnMetadataElement = columnMetadataCopy.find(element => element['columnId']===event.target.name)
      columnMetadataCopy.splice(columnMetadataCopy.indexOf(columnMetadataElement), 1)
      setColumnMetadata(columnMetadataCopy)
      // Remove field from columnData
      var columnDataCopy = Array.from(columnData)
      columnDataCopy.splice(columnIndexNumber, 1)
      setColumnData(columnDataCopy)
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
        <span className='rspace'>Selected fields:</span>
        {fieldItems}
      </div>
      <div>
        {jsonView}
      </div>
    </div>
    );
  }