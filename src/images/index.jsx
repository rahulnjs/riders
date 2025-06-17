import React, { useMemo } from "react";

import { ReactComponent as ThreeDot } from "./three-dot.svg";
import { ReactComponent as DRIVE } from "./drive.svg";
import { ReactComponent as TWO_WHEELER } from "./two-wheeler.svg";
import { ReactComponent as OriginMarker } from "./origin-marker.svg";
import { ReactComponent as DestinationMarker } from "./destination-marker.svg";
import { ReactComponent as TWO_WHEELER_IN_RIDE } from "./two-wheeler-in-ride.svg";

const images = {
  ThreeDot,
  DRIVE,
  TWO_WHEELER,
  OriginMarker,
  DestinationMarker,
  TWO_WHEELER_IN_RIDE,
};

const Image = ({ type, color, strokeColor, text, onClick, onTrip }) => {
  const SVG = useMemo(() => {
    console.log(type, onTrip);
    const _type =
      type === "TWO_WHEELER" && onTrip ? "TWO_WHEELER_IN_RIDE" : type;

    console.log(_type);
    const SVGComponent = images[_type];
    return SVGComponent ? (
      <SVGComponent
        style={{ fill: color || undefined, stroke: strokeColor || undefined }}
      />
    ) : null;
  }, [type, color]);

  return (
    <div className={`img-${type}`} onClick={onClick}>
      {SVG}
      {text !== undefined && <span>{text}</span>}
    </div>
  );
};

export default React.memo(Image);
