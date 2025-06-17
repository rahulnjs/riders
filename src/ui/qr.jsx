import React from "react";
import QRCode from "react-qr-code";

export const QR = ({ tripId }) => {
  return (
    <div
      style={{
        height: "auto",
        margin: "0 auto",
        width: "100%",
        borderRadius: "5px",
      }}
    >
      <QRCode
        size={256}
        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        value={`${window.location.origin}/?trip=${tripId}`}
        viewBox={`0 0 256 256`}
        fgColor="#5233ff"
      />
    </div>
  );
};
