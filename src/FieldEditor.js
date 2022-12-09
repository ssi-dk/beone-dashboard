
import React, {useState} from 'react'
import {atom, useRecoilState} from 'recoil'
import ReactJson from 'react-json-view'

import { sampleState, columnDataState, columnMetadataState } from './RecoilStates'

const jp = require('jsonpath')

export default FieldEditor

function FieldEditor(props) {
  const [samples] = useRecoilState(sampleState);
  const [selectedFields, setSelectedFields] = useState([]);
  const [currentFieldPath, setCurrentFieldPath] = useState();
  const [columnData, setColumnData] = useRecoilState(columnDataState);
  const [columnMetadata, setColumnMetadata] = useRecoilState(columnMetadataState);
  const [filterOnSelected, setFilterOnSelected] = useState(false);

  const filterChangeHandler = () => {
    setFilterOnSelected(!filterOnSelected)
  }

  const fieldSelectHandler = (selection) => {
    let path = [...selection['namespace']]
    path.push(selection['name'])
    path.unshift('$')
    const pathExpression = jp.stringify(path)
    const maxFieldCount = 6
    if (!selectedFields.includes(pathExpression)) {
      if (selectedFields.length >= maxFieldCount) {
        alert('You can only have ' + maxFieldCount + ' selected fields at a time.')
      } else  {
        // Add field to selectedFields
        let selectedFieldsCopy = Array.from(selectedFields)
        selectedFieldsCopy.push(pathExpression)
        setSelectedFields(selectedFieldsCopy)
        // Add header to columnMetadata
        let columnMetadataCopy = Array.from(columnMetadata)
        const currentMetadataElement = {
          'columnId': pathExpression,
          'filter': '',
        }
        columnMetadataCopy.push(currentMetadataElement)
        setColumnMetadata(columnMetadataCopy)
        // Build an array with column data from all samples
        let column = Array()
        for (const entry of props.data) {
          const columnDataForSample = jp.value(entry[1], pathExpression)
          column.push(columnDataForSample)
        }
        // Add column to columnData
        let columnDataCopy = Array.from(columnData)
        columnDataCopy.push(column)
        setColumnData(columnDataCopy)
        // Make this field the current field
        setCurrentFieldPath(pathExpression)
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
      let selectedFieldsCopy = Array.from(selectedFields)
      selectedFieldsCopy.splice(columnIndexNumber, 1)
      setSelectedFields(selectedFieldsCopy)
      // Remove field from columnMetadata
      let columnMetadataCopy = Array.from(columnMetadata)
      const currentMetadataElement = columnMetadataCopy.find(element => element['columnId']===event.target.name)
      columnMetadataCopy.splice(columnMetadataCopy.indexOf(currentMetadataElement), 1)
      setColumnMetadata(columnMetadataCopy)
      // Remove field from columnData
      let columnDataCopy = Array.from(columnData)
      columnDataCopy.splice(columnIndexNumber, 1)
      setColumnData(columnDataCopy)
      setCurrentFieldPath(undefined)
    }
  }

  const currentFieldPathHandler = (event) => {
    // When clicking a field button, show properties for selected field and enable editing them
    setCurrentFieldPath(event.target.name)
  }
  
  const fieldItems = selectedFields.map((path) =>
    <button className='margin' key={path} name={path} onClick={currentFieldPathHandler}>
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
      <div className='rspace'>{key}</div>
      <ReactJson src={value} collapsed='true' onSelect={fieldSelectHandler}/>
    </div>)
  )}

  class FieldForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = columnMetadata.find(element => element.columnId === currentFieldPath)
      this.handleQSChange = this.handleQSChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleQSChange(event) {
      this.setState({filter: event.target.value});
    }
    
    handleSubmit(event) {
      let columnMetadataCopy = Array.from(columnMetadata)
      let index = columnMetadataCopy.findIndex(element => element.columnId === currentFieldPath)
      columnMetadataCopy[index] = this.state
      setColumnMetadata(columnMetadataCopy)
      event.preventDefault();
    }
  
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
            <span className='rspace'>
              Filter:
            </span>
            <span className='rspace'>
              <input type='text' value={this.state.filter} onChange={this.handleQSChange} />
            </span>
          </label>
          <input type='submit' value='Submit' />
          <div className='vspace'>Text values must be surrounded by double quotes.</div>
          <div className='vspace'>Supported Filter Operators:</div>
          <table>
            <tbody>
              <tr><td>{'='}</td><td>Equals</td></tr>
              <tr><td>{'!='}</td><td>Does not equal</td></tr>
              <tr><td>{'<'}</td><td>Less than</td></tr>
              <tr><td>{'<='}</td><td>Less than or equals</td></tr>
              <tr><td>{'>'}</td><td>Greater than</td></tr>
              <tr><td>{'>='}</td><td>Greater than or equals</td></tr>
            </tbody>
          </table>
        </form>
      );
    }
  }  

  const showCurrentField = () => {
    if (currentFieldPath) {
      return(
        <div className='margin'>
          <div>
            <span className='rspace'><label>Path:</label></span><span className='rspace'>{currentFieldPath}</span>
            <button className='margin' name={currentFieldPath} onClick={fieldDeselectHandler}>
              Remove this field
            </button>
          </div>
          <div>
          <FieldForm currentFieldPath={currentFieldPath}/>
          </div>
        </div>
      )
    }
    return 'Not set.'
  }

  return(
    <div className='column2'>
      <h1>Field Editor</h1>
      <div className='row2'>
        <div className='row2'>
          {fieldItems}
        </div>
      </div>
      <div className='pane'>
          <h2>Current Field</h2>
          <div className='row2'>
            {showCurrentField()}
          </div>
      </div>
      <div className='pane'>
      <h2>Field Selector</h2>
      <label>
        <input type='checkbox' name='filter_selected' checked={filterOnSelected} onChange={filterChangeHandler} />
        <span className='margin'>Show selected samples only</span>
      </label>
      {JsonItems()}
      </div>
    </div>
    );
  }