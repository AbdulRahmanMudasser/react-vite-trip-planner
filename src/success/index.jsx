import React, { useEffect, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import { useNavigate } from "react-router-dom";

/**
 * SuccessPage component displays a confirmation message after a successful booking
 * and saves booking details to Firestore.
 */
const SuccessPage = () => {
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(true);
  const navigate = useNavigate();

  /**
   * Save booking details to Firestore on component mount.
   */
  useEffect(() => {
    const saveBooking = async () => {
      try {
        const bookingDetails = JSON.parse(localStorage.getItem("bookingDetails"));
        console.log("Retrieved bookingDetails from localStorage:", bookingDetails);

        if (!bookingDetails) {
          setError("No booking details found. Please try booking again.");
          setIsSaving(false);
          return;
        }

        const { hotel, formData, totalPrice, tripId } = bookingDetails;

        // Log individual fields for debugging
        console.log("tripId:", tripId);
        console.log("hotel:", hotel);
        console.log("hotelName:", hotel?.hotelName);
        console.log("formData:", formData);
        console.log("totalPrice:", totalPrice);

        // Validate required fields
        if (!tripId || !hotel?.hotelName || !formData || !totalPrice) {
          setError(`Incomplete booking details. Missing: ${[
            !tripId && "tripId",
            !hotel?.hotelName && "hotelName",
            !formData && "formData",
            !totalPrice && "totalPrice",
          ]
            .filter(Boolean)
            .join(", ")}. Please try booking again.`);
          setIsSaving(false);
          return;
        }

        // Validate formData fields
        if (
          !formData.checkIn ||
          !formData.checkOut ||
          !formData.guests ||
          !formData.name ||
          !formData.email ||
          !formData.phone
        ) {
          setError("Incomplete form data. Please try booking again.");
          setIsSaving(false);
          return;
        }

        await addDoc(collection(db, "bookings"), {
          hotelId: tripId,
          hotelName: String(hotel.hotelName),
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          guests: Number(formData.guests),
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          totalPrice: Number(totalPrice),
          timestamp: new Date(),
        });

        console.log("Booking saved to Firestore");
        localStorage.removeItem("bookingDetails");
      } catch (err) {
        console.error("Error saving booking to Firestore:", err);
        setError(`Failed to save booking: ${err.message}`);
      } finally {
        setIsSaving(false);
      }
    };

    saveBooking();
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="bg-gray-50 rounded-xl shadow-lg p-6 max-w-md w-full text-center">
        {isSaving ? (
          <p className="text-lg text-gray-500">Saving your booking...</p>
        ) : error ? (
          <>
            <h1 className="text-2xl font-bold text-red-600 mb-4">Booking Error</h1>
            <p className="text-red-500">{error}</p>
            <p className="mt-4 text-gray-600">
              Please contact support or try booking again.
            </p>
            <button
              onClick={() => navigate("/booking")} // Adjust path as needed
              className="mt-4 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 text-center"
            >
              Try Again
            </button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-black mb-4">Booking Successful!</h1>
            <p className="text-gray-600">
              Your booking has been confirmed. Thank you for choosing us!
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 text-center"
            >
              Back to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SuccessPage;