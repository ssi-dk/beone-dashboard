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
  
  // useMemo
  const coordinates = Array.from(samples).map(sample => [sample[1].latitude, sample[1].longitude])
  console.log('Coordinates:')
  console.log(coordinates)

  const markers = [
    { markerOffset: -15, name: "Buenos Aires", coordinates: [8.3816, 54.6037]},
    { markerOffset: -15, name: "La Paz", coordinates: [8.1193, 56.4897] },
    { markerOffset: 25, name: "Brasilia", coordinates: [7.8825, 55.7942] },
    { markerOffset: 25, name: "Santiago", coordinates: [7.6693, 53.4489] },
    { markerOffset: 25, name: "Bogota", coordinates: [4.0721, 54.711] },
    { markerOffset: 25, name: "Quito", coordinates: [8.4678, 51.1807] },
    { markerOffset: -15, name: "Georgetown", coordinates: [8.1551, 56.8013] },
    { markerOffset: -15, name: "Asuncion", coordinates: [7.5759, 55.2637] },
    { markerOffset: 25, name: "Paramaribo", coordinates: [15.2038, 55.852] },
    { markerOffset: 25, name: "Montevideo", coordinates: [6.1645, 54.9011] },
    { markerOffset: -15, name: "Caracas", coordinates: [0.9036, 50.4806] },
    { markerOffset: -15, name: "Lima", coordinates: [7.0428, 52.0464] }
  ];

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
        <Marker key={sample[0]} coordinates={coordinates}>
          <circle r={10} fill="#F00" stroke="#fff" strokeWidth={2} />
          <text
            textAnchor="middle"
            style={{ fontFamily: "system-ui", fill: "#5D5A6D" }}
          >
            {name}
          </text>
        </Marker>
        )}

      {markers.map(({ name, coordinates, markerOffset }) => (
              <Marker key={name} coordinates={coordinates}>
                <circle r={10} fill="#F00" stroke="#fff" strokeWidth={2} />
                <text
                  textAnchor="middle"
                  y={markerOffset}
                  style={{ fontFamily: "system-ui", fill: "#5D5A6D" }}
                >
                  {name}
                </text>
              </Marker>
            ))}

      </ComposableMap>
    </div>
  )
}