import React from 'react';
import { useSelector } from 'react-redux';

import Map from '../components/Map';

const MapContainer = () => {
  const { origin, destination, routes, travelMode } = useSelector((state) => state.map.data);

  return <Map origin={origin} destination={destination} travelMode={travelMode} routes={routes[travelMode] || []} />;
};

export default MapContainer;
