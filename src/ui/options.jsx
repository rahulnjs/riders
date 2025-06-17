import "./options.scss";
import { ReactComponent as Settings } from "../images/settings.svg";
import { ReactComponent as QrIcon } from "../images/qr.svg";
import { ReactComponent as Emergency } from "../images/emergency.svg";
import { useDispatch } from "react-redux";
import { setData } from "../redux/reducers/mapReducer";

export const Options = ({ trip }) => {
  // console.log(trip);
  const dispatch = useDispatch();

  if (!trip) {
    return null;
  }

  const riders = Object.values(trip.riders);

  return (
    <div className="options-pane">
      <div className="trip-info option">
        <div className="trip-duration">
          {trip.duration
            .replace("hours", "h")
            .replace("hour", "h")
            .replace("mins", "m")}
        </div>
        <div className="trip-distance">{trip.distance}</div>
      </div>
      <div className="trip-riders option">
        <div>{riders.length} Riders</div>
      </div>
      <div className="trip-settings option">
        <div className="settings-wrapper">
          <QrIcon onClick={() => dispatch(setData({ showQr: true }))} />
        </div>
        <div className="settings-wrapper">
          <Emergency />
        </div>
        <div className="settings-wrapper">
          <Settings />
        </div>
      </div>
    </div>
  );
};
