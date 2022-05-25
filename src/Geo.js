import React, { useState, useMemo, useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

import { sampleState, columnDataState, columnUserdataState } from './RecoilStates'

export default Geo

function Geo() {
  const [samples, setSamples] = useRecoilState(sampleState);
  const [columnData, setColumnData] = useRecoilState(columnDataState);
  const [columnUserdata, setColumnUserdata] = useRecoilState(columnUserdataState);
  const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

  return (
    <div className='pane'>
      <h1>Geo</h1>
      <ComposableMap>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map(geo => <Geography key={geo.rsmKey} geography={geo} />)
          }
        </Geographies>
      </ComposableMap>
    </div>
  )
}