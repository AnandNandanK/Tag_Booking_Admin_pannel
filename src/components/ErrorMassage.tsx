import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearErrorMassage } from "../slices/eventSlice";

const ErrorPopup: React.FC = () => {
  const dispatch = useAppDispatch();
  const errorMessage = useAppSelector((state) => state.event.errorMassage);
  console.log(errorMessage)

  // Automatically close when errorMessage is cleared
  useEffect(() => {
    if (!errorMessage) return;
  }, [errorMessage]);

  if (!errorMessage) return null; // popup close

  const handleClose = () => {
    dispatch(clearErrorMassage());
  };

  return (
    <div
      className="fixed inset-0  bg-black/30 flex justify-center items-center z-[9999]"
      onClick={handleClose} // background click closes popup
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center"
        onClick={(e) => e.stopPropagation()} // inner click doesn't close
      >
        <h2 className="text-xl font-bold mb-4">Error</h2>
        <p className="mb-6">{errorMessage}</p>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          onClick={handleClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorPopup;
