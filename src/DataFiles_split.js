import {useState} from 'react'

import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
  } from 'recoil'

import DataView from './DataView'

export default DataFiles

const sampleState = atom({
    key: 'sampleState',
    default: new Map(),
  });

const newickState = atom({
  key: 'newickState',
  default: '()',
});

function DataFiles(){
    
	const [samples, setSamples] = useRecoilState(sampleState);
  const [newick, setNewick] = useRecoilState(newickState);
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
      if (f['type'] === 'application/json') {
        const text = await readFile(f)
        const data = await JSON.parse(text)
        const sampleId = data["sample"]["summary"]["sample"]
        if (samplesCopy.has(sampleId)) {
          alert(f.name + " overwrites existing sample ID " + sampleId)
        }
        samplesCopy.set(sampleId, {
          source: "file:///"+f.name,
          inTree: false,
          selected: false,
          clusters: []
        })
        allDataCopy.set(sampleId, data)
      }
      else {
        if (f['name'].endsWith(".nwk"))
        {
          const text = await readFile(f)
          setNewick(text)
        }
        else {
          alert("I don't know what to do with " + f['name'] + '.')
        }
      }
    }
    setSamples(samplesCopy)
    console.log(allDataCopy)
    setAllData(allDataCopy)
    }

    const newickChangeHandler = async (event) => {

      // Make deep copies of states
      const samplesCopy = new Map(JSON.parse(
        JSON.stringify(Array.from(samples))
      ));
      const allDataCopy = new Map(JSON.parse(
        JSON.stringify(Array.from(allData))
      ));
  
      for (let f of event.target.files) {
        if (f['type'] === 'application/json') {
          const text = await readFile(f)
          const data = await JSON.parse(text)
          const sampleId = data["sample"]["summary"]["sample"]
          if (samplesCopy.has(sampleId)) {
            alert(f.name + " overwrites existing sample ID " + sampleId)
          }
          samplesCopy.set(sampleId, {
            source: "file:///"+f.name,
            inTree: false,
            selected: false,
            clusters: []
          })
          allDataCopy.set(sampleId, data)
        }
        else {
          if (f['name'].endsWith(".nwk"))
          {
            const text = await readFile(f)
            setNewick(text)
          }
          else {
            alert("I don't know what to do with " + f['name'] + '.')
          }
        }
      }
      setSamples(samplesCopy)
      console.log(allDataCopy)
      setAllData(allDataCopy)
      }

    function readFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
    
        reader.onload = res => {
          resolve(res.target.result);
        };
        reader.onerror = err => reject(err);
    
        reader.readAsText(file);
      });
    }

	return(
    <div className="pane">
      <div className='row'>
        <div className='column'>
          <div className='vspace'>
            <label>
              <span className='rspace'>Select JSON files:</span>
              <input type="file" name="file" multiple onChange={JSONChangeHandler} />
            </label>
          </div>
        </div>
        <div className='column'>
          <div className='vspace'>
            <label>
              <span className='rspace'>Select Newick file:</span>
              <input type="file" name="file" multiple onChange={JSONChangeHandler} />
            </label>
          </div>
        </div>
      </div>
      <DataView data={allData} />
    </div>
  )

}