// src/ride-cancel/index.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const RideCancelPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-black mb-4">Ride Booking Cancelled</h1>
        <p className="text-gray-600 mb-6">
          Your ride booking was cancelled. Please try again or contact support.
        </p>
        <Link
          to="/"
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default RideCancelPage;