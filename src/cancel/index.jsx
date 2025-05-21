import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * CancelPage component displays a message when a booking is cancelled and provides
 * a button to return to the homepage.
 */
const CancelPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="bg-gray-50 rounded-xl shadow-lg p-6 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-black mb-4">Booking Cancelled</h1>
        <p className="text-gray-600">
          Your booking was not completed. You can try again or return to the homepage.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 text-center"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default CancelPage;