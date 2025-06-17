import { configureStore } from '@reduxjs/toolkit';
import mapReducer from './reducers/mapReducer';

const store = configureStore({
  reducer: {
    map: mapReducer,
  },
});

export default store;
