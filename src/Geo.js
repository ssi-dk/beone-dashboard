import React, { useState, useMemo, useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

import { sampleState, columnDataState, columnUserdataState } from './RecoilStates'

export default Geo

function Geo() {
  const [samples, setSamples] = useRecoilState(sampleState);
  const [columnData, setColumnData] = useRecoilState(columnDataState);
  const [columnUserdata, setColumnUserdata] = useRecoilState(columnUserdataState);
  const geoUrl =
  'https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json';

  return (
    <div className='pane'>
      <h1>Geography</h1>
      <ComposableMap
        projection='geoAzimuthalEqualArea'
        projectionConfig={{
          rotate: [-20.0, -52.0, 0],
          scale: 900
        }}
      >
        <Geographies
          geography={geoUrl}
          fill='#D6D6DA'
          stroke='#FFFFFF'
          strokeWidth={0.5}
        >
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography key={geo.rsmKey} geography={geo} />
            ))
          }
        </Geographies>

        {Array.from(samples).map(sample => 
        <Marker key={sample[0]} coordinates={[sample[1].longitude, sample[1].latitude]}>
          <circle r={5} fill='#00F' stroke='#fff' strokeWidth={2} />
          <text
            textAnchor='middle'
            style={{ fontFamily: 'system-ui', fill: '#5D5A6D' }}
          >
            {name}
          </text>
        </Marker>
        )}
      </ComposableMap>
    </div>
  )
}