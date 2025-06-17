import React, { useRef, useEffect, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import "./PlaceAutocompleteInput.scss";

const PlaceAutocompleteInput = ({ onPlaceSelect, placeholder, value }) => {
  const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
  const [ipValue, setIpValue] = useState(value);
  const inputRef = useRef(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ["place_id", "geometry", "name", "formatted_address"],
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener("place_changed", () => {
      setTimeout(() => {
        setIpValue(placeAutocomplete.getPlace().formattedAddress);
      }, 500);
      onPlaceSelect(placeAutocomplete.getPlace());
    });
  }, [onPlaceSelect, placeAutocomplete]);

  return (
    <div className="autocomplete-container">
      <input ref={inputRef} placeholder={placeholder} />
    </div>
  );
};

export default PlaceAutocompleteInput;
