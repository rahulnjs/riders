import React, { useEffect } from 'react';

const MapHandler = ({ map, stops }) => {
  useEffect(() => {
    if (!map) return;

    if (stops.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      stops.forEach((stop) => {
        bounds.extend(new window.google.maps.LatLng(stop.position.lat, stop.position.lng));
      });
      map.fitBounds(bounds);
    }

    if (stops.length === 1) {
      map.setZoom(14);
    }
  }, [map, stops]);

  return null;
};

export default React.memo(MapHandler);
