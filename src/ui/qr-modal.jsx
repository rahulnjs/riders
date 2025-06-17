import ReactModal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { setData } from "../redux/reducers/mapReducer";
import { QR } from "./qr";

const customStyles = {
  content: {
    width: "300px",
  },
};

export const QrModal = () => {
  const dispatch = useDispatch();
  const { showQr, tripId, onQrClose } = useSelector((state) => state.map.data);

  return (
    <ReactModal
      isOpen={showQr}
      onRequestClose={() => dispatch(setData({ showQr: false }))}
      contentLabel="QR Modal"
      customStyles={customStyles}
      style={{
        content: {
          width: "300px",
          height: "fit-content",
          margin: "0px auto",
          boxShadow: "-1px 1px 21px 2px #00000078",
        },
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontSize: "1.5rem",
          marginBottom: "32px",
          fontWeight: 800,
        }}
        className="rfont"
      >
        Trip details
      </h2>
      <QR tripId={tripId} />

      <h2
        style={{
          textAlign: "center",
          color: "gray",
          margin: "20px 0px",
        }}
        className="rfont"
      >
        OR
      </h2>
      <h6
        style={{
          textAlign: "center",
          marginBottom: "24px",
        }}
        className="rfont"
      >
        {window.location.href +
          (!window.location.search ? "?trip=" + tripId : "")}
      </h6>
      <button
        className="primary-button"
        onClick={() => {
          dispatch(setData({ showQr: false }));
          onQrClose();
        }}
      >
        Close
      </button>
    </ReactModal>
  );
};
