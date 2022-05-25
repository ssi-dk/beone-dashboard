import React, { useState, useMemo, useEffect } from 'react'
import { useRecoilState } from 'recoil'

import { sampleState, columnDataState, columnUserdataState } from './RecoilStates'

export default Geo

function Geo() {
  const [samples, setSamples] = useRecoilState(sampleState);
  const [columnData, setColumnData] = useRecoilState(columnDataState);
  const [columnUserdata, setColumnUserdata] = useRecoilState(columnUserdataState);

  return (
    <div className='pane'>
        <h1>Geo</h1>
    </div>
  )

}