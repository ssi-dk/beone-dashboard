import {useState} from 'react'

import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
  } from 'recoil'

import DataView from './DataView'
import {readFile} from './utils'

export default DataFiles

const sampleState = atom({
    key: 'sampleState',
    default: new Map(),
  });

function DataFiles(){
    
	const [samples, setSamples] = useRecoilState(sampleState);
  // allData is only used locally, so we don't need Recoil.
  const [allData, setAllData] = useState(new Map());

	const JSONChangeHandler = async (event) => {

    // Make deep copies of states
    const samplesCopy = new Map(JSON.parse(
      JSON.stringify(Array.from(samples))
    ));
    const allDataCopy = new Map(JSON.parse(
      JSON.stringify(Array.from(allData))
    ));

    for (let f of event.target.files) {
      if (f['name'].endsWith(".json")) {
        const text = await readFile(f)
        const data = await JSON.parse(text)
        const sampleId = data["sample"]["summary"]["sample"]
        if (samplesCopy.has(sampleId)) {
          /* We do not want to override an existing item here, as this would
          cause loss of information (inTree, selected, clusters). */
          alert(f.name + " was not imported as it would overwrite existing sample ID " + sampleId)
        } else {
          samplesCopy.set(sampleId, {
            source: "file:///" + f.name,
            inTree: false,  // The tree should tell wether it knows the sample or not.
            selected: false,
            clusters: []
          })
          allDataCopy.set(sampleId, data)
        }
      }
      else {
        alert("Filename must end with '.json'.")
      }
    }
    setSamples(samplesCopy)
    setAllData(allDataCopy)
    }

	return(
   <div className="pane">
      <div className='vspace'>
        <label>
          <span className='rspace'>Select JSON file(s):</span>
			    <input type="file" name="file" multiple onChange={JSONChangeHandler} />
        </label>
      </div>
      <DataView data={allData}/>
		</div>
	)

}