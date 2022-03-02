import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
  } from 'recoil'

export default Epi

const sampleState = atom({
    key: 'sampleState',
    default: new Map(),
  });

function Epi(props){
  const [samples, setSamples] = useRecoilState(sampleState);

  return(
      <div className="pane">
        <h1>Epi</h1>
        <div className="row row-header">
          <div className="column">
            <h2>
              January
            </h2>
          </div>
          <div className="column">
            <h2>
              February
            </h2>
          </div>
          <div className="column">
            <h2>
              March
            </h2>
          </div>
          <div className="column">
            <h2>
              April
            </h2>
          </div>
          <div className="column">
            <h2>
              May
            </h2>
          </div>
          <div className="column">
            <h2>
              June
            </h2>
          </div>
          <div className="column">
            <h2>
              July
            </h2>
          </div>
          <div className="column">
            <h2>
              August
            </h2>
          </div>
          <div className="column">
            <h2>
              September
            </h2>
          </div>
          <div className="column">
            <h2>
              October
            </h2>
          </div>
          <div className="column">
            <h2>
              November
            </h2>
          </div>
          <div className="column">
            <h2>
              December
            </h2>
          </div>
        </div>
      </div>
    );
  }