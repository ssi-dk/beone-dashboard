
import { atom } from 'recoil'

const sampleState = atom({
  key: 'sampleState',
  default: new Map(),
});
export { sampleState }

const columnDataState = atom({
  key: 'columnDataState',
  default: new Array(),
});
export { columnDataState }

const columnMetadataState = atom({
  key: 'columnMetadataState',
  default: new Array(),
});
export { columnMetadataState }

const newickState = atom({
    key: 'newickState',
    default: '()',
  });
export { newickState }

const clusterState = atom({
  key: 'clusterState',
  default: new Array(),
});
export { clusterState }