import React, { useState, useEffect } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { Polyline as EPolyline } from './external/Polyline';
import { SPEED_COLORS } from '../../constants';
import Image from '../../images';
import { formatDuration } from '../../services/time';
import './Polyline.scss';

const Polyline = ({ route, activeRoute, routeIndex, onClick }) => {
  const [polylines, setPolylines] = useState([]);
  const geometryLibrary = useMapsLibrary('geometry');

  useEffect(() => {
    if (!route?.polyline?.encodedPolyline || !geometryLibrary) return;

    const decodePath = (encodedPath) => {
      return geometryLibrary.encoding.decodePath(encodedPath).map((point) => ({
        lat: point.lat(),
        lng: point.lng(),
      }));
    };

    const polylinePoints = decodePath(route.polyline.encodedPolyline);

    let zIndex = route.travelAdvisory.speedReadingIntervals.length + 2;
    const newPolylines = route.travelAdvisory.speedReadingIntervals.map((interval) => {
      const newPoints = polylinePoints.slice(interval.startPolylinePointIndex, interval.endPolylinePointIndex + 1);

      return {
        path: geometryLibrary.encoding.encodePath(newPoints),
        options: {
          zIndex: 100 - routeIndex + zIndex--,
          strokeColor: SPEED_COLORS[interval.speed] || SPEED_COLORS.NORMAL,
          strokeOpacity: routeIndex === activeRoute ? 1.0 : 0.5,
          strokeWeight: 6,
        },
      };
    });

    setPolylines(newPolylines);

    return () => {
      setPolylines([]);
    };
  }, [route, geometryLibrary, routeIndex, activeRoute]);

  return (
    <>
      {polylines.map((polyline, index) => (
        <EPolyline
          key={`p-${index}`}
          onClick={(e) => onClick(e, route, routeIndex)}
          encodedPath={polyline.path}
          {...polyline.options}
        />
      ))}
    </>
  );
};

export default React.memo(Polyline);

export const InfoWindow = ({ route, travelMode }) => (
  <div className="polyline-info-window">
    <div className="content">
      <div className="title">
        <Image type={travelMode} color="#212121" />
        <b>{formatDuration(route.duration)}</b>
      </div>
      <div className="distanceMeters">
        <p>{(route.distanceMeters / 1000).toFixed(2)} km</p>
      </div>
    </div>
  </div>
);
