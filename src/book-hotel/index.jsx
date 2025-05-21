import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";

// Load Stripe with public key from environment variable
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "");

const HotelBookingPage = () => {
  const { tripId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const hotel = state?.hotel;

  const [pricePerNight, setPricePerNight] = useState(0);
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
    name: "",
    email: "",
    phone: "",
  });
  const [totalNights, setTotalNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Formats a number with commas for display.
   * @param {number} number - The number to format.
   * @returns {string} Formatted number or "N/A" if invalid.
   */
  const formatNumberWithCommas = useCallback((number) => {
    if (!Number.isFinite(number) || number <= 0) return "N/A";
    return Math.round(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }, []);

  /**
   * Validate tripId and hotel on mount.
   */
  useEffect(() => {
    console.log("tripId from useParams:", tripId);
    console.log("Hotel from state:", hotel);

    if (!tripId) {
      setError("Invalid trip ID.");
      navigate("/");
      return;
    }
    if (!hotel || !hotel.hotelName) {
      setError("Hotel information is missing.");
      navigate("/");
    }
  }, [tripId, hotel, navigate]);

  /**
   * Calculate price per night from hotel data.
   */
  useEffect(() => {
    if (!hotel?.price) {
      setPricePerNight(0);
      setError("Hotel price information is missing.");
      return;
    }

    const priceString = hotel.price;
    const priceMatches = priceString.match(/([\d,]+)\s*-\s*([\d,]+)/);

    if (priceMatches) {
      const price1 = parseInt(priceMatches[1].replace(/,/g, ""), 10);
      const price2 = parseInt(priceMatches[2].replace(/,/g, ""), 10);
      if (Number.isFinite(price1) && Number.isFinite(price2) && price1 > 0 && price2 > 0) {
        const average = (price1 + price2) / 2;
        const finalPrice = average + 5000; // Additional fee in PKR
        setPricePerNight(finalPrice);
      } else {
        setPricePerNight(0);
        setError("Invalid hotel price format.");
      }
    } else {
      const fallbackPrice = parseFloat(hotel?.pricePerNight ?? hotel?.price ?? 0);
      setPricePerNight(Number.isFinite(fallbackPrice) && fallbackPrice > 0 ? fallbackPrice : 0);
      if (fallbackPrice <= 0) {
        setError("Invalid fallback price.");
      }
    }
  }, [hotel?.price, hotel?.pricePerNight]);

  /**
   * Fetch number of guests from Firebase based on tripId.
   */
  useEffect(() => {
    if (!tripId) return;

    const fetchGuestCount = async () => {
      try {
        const snap = await getDoc(doc(db, "AITrips", tripId));
        if (snap.exists()) {
          const numberOfPeople = parseInt(snap.data().userSelection?.numberOfPeople, 10);
          if (Number.isFinite(numberOfPeople)) {
            setFormData((prev) => ({ ...prev, guests: numberOfPeople }));
          }
        } else {
          setError("Trip not found.");
        }
      } catch (err) {
        console.error("Error fetching guest count:", err);
        setError("Failed to load trip details.");
      }
    };

    fetchGuestCount();
  }, [tripId]);

  /**
   * Calculate total nights and price based on check-in/check-out dates.
   */
  useEffect(() => {
    const { checkIn, checkOut } = formData;
    if (!checkIn || !checkOut) return;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);

    if (Number.isFinite(nights) && nights > 0) {
      setTotalNights(nights);
      setTotalPrice(nights * pricePerNight);
      setError("");
    } else {
      setTotalNights(0);
      setTotalPrice(0);
      setError("Check-out date must be after check-in date.");
    }
  }, [formData.checkIn, formData.checkOut, pricePerNight]);

  /**
   * Handle form input changes.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input event.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Handle form submission to initiate Stripe checkout.
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate form data
    if (
      !formData.checkIn ||
      !formData.checkOut ||
      formData.guests < 1 ||
      !formData.name ||
      !formData.email ||
      !formData.phone
    ) {
      setError("Please fill in all fields.");
      return;
    }
    if (totalNights <= 0 || !Number.isFinite(totalPrice) || totalPrice <= 0) {
      setError("Please select valid check-in and check-out dates and ensure a valid price.");
      return;
    }
    if (!tripId || !hotel?.hotelName) {
      setError("Missing trip or hotel information.");
      return;
    }

    setIsLoading(true);
    try {
      // Check if Stripe is loaded
      if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
        throw new Error("Stripe public key is not configured.");
      }

      const bookingDetails = {
        hotel,
        formData,
        totalPrice,
        pricePerNight,
        tripId,
        timestamp: new Date().toISOString(),
      };

      // Log bookingDetails for debugging
      console.log("Preparing to save bookingDetails:", bookingDetails);

      // Save to localStorage with error handling
      try {
        localStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));
        console.log("Successfully saved to localStorage:", JSON.parse(localStorage.getItem("bookingDetails")));
      } catch (storageError) {
        console.error("Failed to save to localStorage:", storageError);
        throw new Error("Unable to save booking details to localStorage.");
      }

      const response = await fetch("http://localhost:8000/api/create-checkout-session/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          tripId,
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          guests: formData.guests,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          totalPrice,
          pricePerNight,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Error creating checkout session");
      }

      const { id: sessionId } = await response.json();

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe failed to initialize.");
      }

      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });
      if (stripeError) {
        throw new Error(stripeError.message);
      }
    } catch (err) {
      console.error("Payment initiation error:", err);
      setError(`Payment error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Prepare display data
  const hotelName = hotel?.hotelName ? String(hotel.hotelName) : "Unknown Hotel";
  const hotelAddress = hotel?.hotelAddress ? String(hotel.hotelAddress) : "N/A";
  const rating = Number.isFinite(hotel?.rating) && hotel.rating > 0 ? hotel.rating : "Not Rated";
  const hotelImageURL =
    hotel?.hotelImageURL || "https://placehold.co/800?text=Loading+Image&font=roboto";

  if (!hotel || !tripId) {
    return (
      <div className="text-center p-4 text-black">
        Loading hotel details or invalid trip ID...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto max-w-4xl bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-black mb-6">Book {hotelName}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Hotel Details */}
          <div className="space-y-4">
            <div className="bg-white text-black p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-2xl font-bold text-black mb-2">{hotelName}</h2>
              <p className="text-gray-600 text-sm mb-1">📍 {hotelAddress}</p>
              <p className="text-sm font-medium text-black mb-1">⭐ {rating}</p>
              <p className="text-sm font-semibold text-black">
                💰 Rs. {formatNumberWithCommas(pricePerNight)} Per Night
              </p>
            </div>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black">Check-in Date</label>
              <input
                type="date"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleInputChange}
                min={new Date().toISOString().split("T")[0]}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">Check-out Date</label>
              <input
                type="date"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleInputChange}
                min={formData.checkIn || new Date().toISOString().split("T")[0]}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">Number of Guests</label>
              <div className="flex flex-col">
                <input
                  type="number"
                  name="guests"
                  value={formData.guests}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  We've pre-filled this from your trip details
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-black">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500"
                required
              />
            </div>

            {/* Booking Summary */}
            {totalNights > 0 && (
              <div className="mt-6 p-5 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-bold text-lg text-black mb-2">Booking Summary</h3>
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-sm text-black">Duration:</p>
                  <p className="text-sm font-medium text-right text-black">
                    {totalNights} {totalNights === 1 ? "Night" : "Nights"}
                  </p>
                  <p className="text-sm text-black">Guests:</p>
                  <p className="text-sm font-medium text-right text-black">
                    {formData.guests} {formData.guests === 1 ? "Person" : "People"}
                  </p>
                  <p className="text-sm text-black">Price Per Night:</p>
                  <p className="text-sm font-medium text-right text-black">
                    Rs. {formatNumberWithCommas(pricePerNight)}
                  </p>
                  <p className="text-sm font-bold text-black">Total Price:</p>
                  <p className="text-sm font-bold text-right text-black">
                    Rs. {formatNumberWithCommas(totalPrice)}
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Payment Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 hover:text-white text-center transition-colors disabled:bg-gray-600"
            >
              {isLoading ? "Processing..." : "Proceed to Payment"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HotelBookingPage;