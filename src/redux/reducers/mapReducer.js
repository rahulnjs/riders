import { createSlice } from '@reduxjs/toolkit';
import { TRAVEL_MODES } from '../../constants';

const initialState = {
  data: {
    travelMode: TRAVEL_MODES[0],
    origin: {},
    destination: {},
    routes: {},
    error: '',
    activeRoute: 0,
    onTrip: false,
    showQr: false,
    tripId: '',
    trip: null,
    onQrClose: () => { }
  },
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setData(state, action) {
      state.data = {
        ...state.data,
        ...action.payload,
      };
    },
  },
});

export const { setData } = mapSlice.actions;
export default mapSlice.reducer;
