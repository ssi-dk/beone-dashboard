import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
  } from 'recoil'

export default FileUploader

const sampleState = atom({
    key: 'sampleState',
    default: {},
  });

function FileUploader(){
    
	const [samples, setSamples] = useRecoilState(sampleState);

	const changeHandler = async (event) => {
    var samples2 = {
      ...samples
    };

    for (let f of event.target.files) {
      if (f['type'] === 'application/json') {
        console.log(f['name'] + " seems to be a JSON file.")
        const text = await readFile(f, samples2)
        const data = await JSON.parse(text)
        const sampleId = data["sample"]["summary"]["sample"]
        samples2[sampleId] = data
        }
      }

    setSamples(samples2)
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
      <h1>
        <div>Files</div>
      </h1>
			<input type="file" name="file" multiple onChange={changeHandler} />
		</div>
	)

}