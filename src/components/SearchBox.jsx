import React from "react";
import PlaceAutocompleteInput from "./PlaceAutocompleteInput";
import { TRAVEL_MODES } from "../constants";
import { formatDuration } from "../services/time";
import Image from "../images";

import "./SearchBox.scss";

const SearchBox = ({
  routes,
  travelMode,
  onTravelModeChange,
  onOriginAddressChange,
  onDestinationAddressChange,
  onTripStart,
  origin,
}) => {
  return (
    <div className="search-box">
      <div className="travel-mode-filter-btns">
        {TRAVEL_MODES.map((mode) => {
          const duration = formatDuration(routes[mode]?.[0]?.duration);
          return (
            <button
              key={mode}
              className={travelMode === mode ? "active" : ""}
              onClick={() => onTravelModeChange(mode)}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image type={mode} />
              {duration && (
                <span style={{ fontSize: "small" }}>{duration}</span>
              )}
            </button>
          );
        })}
      </div>
      <div className="input-address-group">
        <Image type="ThreeDot" />
        <PlaceAutocompleteInput
          onPlaceSelect={onOriginAddressChange}
          placeholder={"From"}
          value={origin}
        />
        <PlaceAutocompleteInput
          onPlaceSelect={onDestinationAddressChange}
          placeholder={"To"}
        />
      </div>
      <div>
        <button className="primary-button" onClick={onTripStart}>
          Start trip
        </button>
      </div>
    </div>
  );
};

export default SearchBox;
