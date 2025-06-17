import React, { useMemo, useState } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import MapContainer from "./containers/MapContainer";
import SearchBoxContainer from "./containers/SearchBoxContainer";
import "./App.scss";
import { getDirections, getNearbyPlace } from "./services/google";
import { useDispatch, useSelector } from "react-redux";
import { setData } from "./redux/reducers/mapReducer";
import { processSearch } from "./utils/process-search";
import axios from "axios";
import { QrModal } from "./ui/qr-modal";
import { Options } from "./ui/options";

const App = () => {
  const dispatch = useDispatch();
  const { onTrip, routes } = useSelector((state) => state.map.data);
  const search = useMemo(() => processSearch(), [onTrip]);
  const [lastLoc, setLastLoc] = useState(null);
  const [cTrip, setCTrip] = useState(null);

  const onNearByPlace = (p) => {
    dispatch(
      setData({
        origin: {
          name: p.places[0]?.formattedAddress,
          formattedAddress:
            p.places[0].shortFormattedAddress +
            ", " +
            p.places[0]?.formattedAddress,
          position: {
            lat: p.places[0].location.latitude,
            lng: p.places[0].location.longitude,
          },
          place_id: p.places[0].id,
        },
      })
    );
  };

  const haveIMoved = (cLoc) => {
    if (!lastLoc) {
      return true;
    } else {
      return (
        lastLoc.lat.toFixed(3) !== cLoc.lat.toFixed(3) ||
        lastLoc.lng.toFixed(3) !== cLoc.lng.toFixed(3)
      );
    }
  };

  function getLocation(trip) {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("here");
        const { latitude: lat, longitude: lng } = position.coords;
        window.sessionStorage.setItem("loc", JSON.stringify({ lat, lng }));
        if (trip) {
          if (!window.localStorage.getItem("_cu_")) {
            let person = prompt("Please enter your name");
            if (person == null || person == "") {
              window.location.assign("/");
            } else {
              window.localStorage.setItem("_cu_", person);
              console.log({
                cLoc: { lng, lat },
                iLoc: { lng, lat },
                lastUpdated: new Date().getTime(),
                createdAt: new Date().getTime(),
                name: person,
              });
              axios
                .post(`${process.env.REACT_APP_API_URL}/trip/${trip}/rider`, {
                  riderId: person,
                  riderData: {
                    cLoc: { lng, lat },
                    iLoc: { lng, lat },
                    lastUpdated: new Date().getTime(),
                    createdAt: new Date().getTime(),
                    name: person,
                  },
                })
                .then((d) => {})
                .catch(console.error);
              fetchTripAndProceed(trip, lat, lng);
            }
          } else {
            fetchTripAndProceed(trip, lat, lng);
          }
        }
        getNearbyPlace()
          .then(onNearByPlace)
          .catch((err) => console.error(err));
      },
      (error) => {
        alert("Unable to retrieve your location.");
      }
    );
  }

  const fetchTripAndProceed = (trip, lat, lng) => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/trip/${trip}`)
      .then(({ data }) => {
        if (haveIMoved({ lat, lng })) {
          getDirections({
            origin: {
              location: {
                latLng: {
                  latitude: lat,
                  longitude: lng,
                },
              },
            },
            destination: { place_id: data.to.place_id },
            travelMode: data.config.travelMode,
            routingPreference: "traffic_aware",
            extraComputations: ["TRAFFIC_ON_POLYLINE"],
            alertnateRoute: false,
          }).then((direction) => {
            updateAppStore(data, direction, { lat, lng });
          });
        } else {
          updateAppStore(
            data,
            { routes: routes[data.config.travelMode] },
            {
              lat,
              lng,
            }
          );
        }
      });
    axios
      .put(`${process.env.REACT_APP_API_URL}/trip/${trip}/rider`, {
        riderId: window.localStorage.getItem("_cu_"),
        cLoc: { lng, lat },
        lastUpdated: new Date().getTime(),
      })
      .then((d) => {})
      .catch(console.error);
  };

  const updateAppStore = (data, direction, cL) => {
    dispatch(
      setData({
        onTrip: true,
        tripId: data.uuid,
        trip: data,
        travelMode: data.config.travelMode,
        routes: { [data.config.travelMode]: direction.routes },
        origin: {
          position: cL,
        },
        destination: {
          position: data.to,
        },
      })
    );
    setLastLoc(cL);
    setCTrip({
      ...data,
      duration: direction.routes[0].localizedValues.duration.text,
      distance: `${(direction.routes[0].distanceMeters / 1000).toFixed(2)} Km`,
      _distance: direction.routes[0].distanceMeters,
      _duration: parseInt(direction.routes[0].duration.replace("s", "")),
    });
  };

  React.useEffect(() => {
    getLocation(search.trip);
  }, []);

  const refresh_nav = () => {
    if (onTrip) {
      getLocation(search.trip);
    }
  };

  React.useEffect(() => {
    let x = setInterval(refresh_nav, 10000);
    return () => clearInterval(x);
  }, []);

  return (
    <div className="App">
      <APIProvider apiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
        {!search.trip && (
          <div className="control-pannel">
            <SearchBoxContainer />
          </div>
        )}
        <MapContainer />
        <QrModal />
        {onTrip && <Options trip={cTrip} />}
      </APIProvider>
    </div>
  );
};

export default App;
