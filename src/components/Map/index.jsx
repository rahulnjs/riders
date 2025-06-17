import React, { useMemo, useState } from "react";
import { useMap, Map as Gmap, InfoWindow } from "@vis.gl/react-google-maps";
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  DEFAULT_MAP_ZOOM_ON_TRIP,
} from "../../constants";
import Marker from "./Marker";
import Polyline, { InfoWindow as PolylineInfoWindow } from "./Polyline";
import MapHandler from "./MapHandler";
import { useDispatch, useSelector } from "react-redux";
import { setData } from "../../redux/reducers/mapReducer";

const Map = ({ origin, destination, travelMode, routes }) => {
  const map = useMap();
  const [infoWindow, setInfoWindow] = useState(null);
  const [activeRoute, setActiveRoute] = useState(0);
  const currentLocation = window.sessionStorage.getItem("loc");

  const dispatch = useDispatch();

  const { onTrip, trip } = useSelector((state) => state.map.data);

  const stops = useMemo(() => {
    const stopsArray = [];
    if (origin?.position) stopsArray.push(origin);
    if (destination?.position) stopsArray.push(destination);
    return stopsArray;
  }, [origin, destination]);

  const handlePolylineClick = (event, route, routeIndex) => {
    const position = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setActiveRoute(routeIndex);
    dispatch(setData({ activeRoute: routeIndex }));
    setInfoWindow({
      position,
      content: <PolylineInfoWindow route={route} travelMode={travelMode} />,
    });
  };

  return (
    <Gmap
      mapId={process.env.REACT_APP_RIDERS_GOOGLE_MAP_ID}
      defaultZoom={onTrip ? DEFAULT_MAP_ZOOM_ON_TRIP : DEFAULT_MAP_ZOOM}
      defaultCenter={
        currentLocation ? JSON.parse(currentLocation) : DEFAULT_MAP_CENTER
      }
      gestureHandling="greedy"
      disableDefaultUI={true}
      //center={onTrip ? JSON.parse(currentLocation) : DEFAULT_MAP_CENTER}
      //zoomControl={true}
      //fullscreenControl={true}
    >
      <MapHandler map={map} stops={stops} />
      {!onTrip && origin && (
        <Marker type={travelMode} position={origin.position} />
      )}
      {onTrip &&
        trip &&
        Object.values(trip.riders).map((rider) => (
          <Marker
            type={trip.config.travelMode}
            position={rider.cLoc}
            text={rider.name}
            onTrip={onTrip}
          />
        ))}
      {destination && (
        <Marker type="DestinationMarker" position={destination.position} />
      )}
      {routes.map((route, routeIndex) => (
        <Polyline
          key={`polyline-${routeIndex}`}
          route={route}
          activeRoute={activeRoute}
          routeIndex={routeIndex}
          onClick={handlePolylineClick}
        />
      ))}
      {infoWindow && (
        <InfoWindow
          key={infoWindow.position.lat + "," + infoWindow.position.lng}
          position={infoWindow.position}
          onCloseClick={() => setInfoWindow(null)}
        >
          {infoWindow.content}
        </InfoWindow>
      )}
    </Gmap>
  );
};

export default React.memo(Map);
