import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setData } from "../redux/reducers/mapReducer";
import SearchBox from "../components/SearchBox";
import { getDirections } from "../services/google";
import { TRAVEL_MODES } from "../constants";
import axios from "axios";

const SearchBoxContainer = () => {
  const { travelMode, routes, origin, destination, activeRoute } = useSelector(
    (state) => state.map.data
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchDirections = async () => {
      if (
        origin &&
        destination &&
        Object.keys(origin).length &&
        Object.keys(destination).length
      ) {
        try {
          const newRoutes = {};
          for (const mode of TRAVEL_MODES) {
            const res = await getDirections({
              origin: { address: origin.formattedAddress },
              destination: { address: destination.formattedAddress },
              travelMode: mode,
              routingPreference: "traffic_aware",
              extraComputations: ["TRAFFIC_ON_POLYLINE"],
            });
            newRoutes[mode] = res?.routes || [];
          }
          dispatch(setData({ routes: newRoutes }));
        } catch (error) {
          console.error("Failed to fetch directions:", error);
          dispatch(
            setData({ routes: [], error: "Failed to fetch directions" })
          );
        }
      }
    };

    fetchDirections();
  }, [origin, destination, dispatch]);

  const handleAddressChange = (type, address) => {
    dispatch(
      setData({
        [type]: {
          name: address.name,
          formattedAddress: address.formatted_address,
          position: {
            lat: address.geometry.location.lat(),
            lng: address.geometry.location.lng(),
          },
          place_id: address.place_id,
        },
      })
    );
  };

  const onTripStart = () => {
    const to = {
      ...destination.position,
      fmtAdd: destination.formattedAddress,
      place_id: destination.place_id,
    };
    const from = {
      ...origin.position,
      fmtAdd: origin.formattedAddress,
      place_id: origin.place_id,
    };

    const currentLocation = JSON.parse(window.sessionStorage.getItem("loc"));
    const route = routes[travelMode][activeRoute];
    const trip = {
      to,
      from,
      riders: {
        rahul: {
          iLoc: currentLocation,
          cLoc: currentLocation,
          createdAt: new Date().getTime(),
          lastUpdated: new Date().getTime(),
          name: "Rahul",
          creator: true,
        },
      },
      config: {
        travelMode,
        break: 40,
        distance: (route.distanceMeters / 1000).toFixed(2),
      },
    };

    axios
      .post(`${process.env.REACT_APP_RIDERS_API_URL}/trip`, trip, {})
      .then(({ data }) => {
        //window.history.pushState({}, "", `/?trip=${data.uuid}&join=true`);
        window.localStorage.setItem("_cu_", "rahul");
        dispatch(
          setData({
            onTrip: true,
            showQr: true,
            tripId: data.uuid,
            trip,
            onQrClose: () => window.location.assign(`/?trip=${data.uuid}`),
          })
        );
      });
  };

  return (
    <SearchBox
      travelMode={travelMode}
      routes={routes}
      onTravelModeChange={(mode) => dispatch(setData({ travelMode: mode }))}
      onOriginAddressChange={(address) =>
        handleAddressChange("origin", address)
      }
      onDestinationAddressChange={(address) =>
        handleAddressChange("destination", address)
      }
      onTripStart={onTripStart}
      origin={origin?.formattedAddress}
    />
  );
};

export default SearchBoxContainer;
