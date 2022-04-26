
import {React, useState, useMemo } from 'react'
import {atom, useRecoilState} from 'recoil'
import ReactJson from 'react-json-view'
const jp = require('jsonpath')

export default FieldEditor

const sampleState = atom({
  key: 'sampleState',
  default: new Map(),
});

const columnDataState = atom({
  key: 'columnDataState',
  default: new Array(),
});

const columnMetadataState = atom({
  key: 'columnMetadataState',
  default: new Array(),
});

function FieldEditor(props) {
  const [samples] = useRecoilState(sampleState);
  const [selectedFields, setSelectedFields] = useState([]);
  const [currentField, setCurrentField] = useState();
  const [columnData, setColumnData] = useRecoilState(columnDataState);
  const [columnMetadata, setColumnMetadata] = useRecoilState(columnMetadataState);
  const [filterOnSelected, setFilterOnSelected] = useState(false);

  const filterChangeHandler = () => {
    setFilterOnSelected(!filterOnSelected)
  }

  const fieldSelectHandler = (selection) => {
    var path = [...selection['namespace']]
    path.push(selection['name'])
    path.unshift('$')
    const pathExpression = jp.stringify(path)
    const maxFieldCount = 6
    if (!selectedFields.includes(pathExpression)) {
      if (selectedFields.length >= maxFieldCount) {
        alert('You can only have ' + maxFieldCount + ' selected fields at a time.')
      } else  {
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
        // Make this field the current field
        setCurrentField(pathExpression)
      }
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
      setCurrentField(undefined)
    }
  }

  const currentFieldHandler = (event) => {
    // When clicking a field button, show properties for selected field and enable editing them
    setCurrentField(event.target.name)
  }
  
  const fieldItems = selectedFields.map((path) =>
    <button className='margin' key={path} name={path} onClick={currentFieldHandler}>
      {path}
    </button>
  )

  function filterItems(allDataArray, samples) {
    return allDataArray.filter(function (sample) {
      return samples.get(sample[0])['selected']
    })
  }

  function JsonItems() {
    const dataToShow = filterOnSelected ? filterItems(props.data, samples) : props.data
    return(
    dataToShow.map(([key, value]) =>
    <div className='data-row' key={key}>
      <div>{key}</div>
      <ReactJson src={value} collapsed='true' onSelect={fieldSelectHandler}/>
    </div>)
  )}

  const showCurrentField = () => {
    if (currentField) {
      return(
        <span className='margin'>
          {currentField}
          <button className='margin' name={currentField} onClick={fieldDeselectHandler}>
            Remove this field
          </button>
        </span>
      )
    }
    return 'Not set.'
  }

  return(
    <div>
      <h1>Field Editor</h1>
      <div className='pane'>
        <h2>Selected Fields</h2>
        <div className='row'>
          {fieldItems}
        </div>
      </div>
      <div className='pane'>
          <h2>Current Field</h2>
          {showCurrentField()}
      </div>
      <div className='pane'>
      <h2>Data Picker</h2>
      <label>
        <input type='checkbox' name='filter_selected' checked={filterOnSelected} onChange={filterChangeHandler} />
        <span className='margin'>Show selected samples only</span>
      </label>
      {JsonItems()}
      </div>
    </div>
    );
  }