// src/components/RideBookingPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { doc, getDoc, setDoc, collection } from 'firebase/firestore';
import { db } from '@/service/firebaseConfig';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

const RideBookingPage = () => {
  const { rideOptionId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { ride, rideId, departure, destination } = state || {};

  const [rideCost, setRideCost] = useState(0);
  const [formData, setFormData] = useState({
    pickupTime: '',
    passengers: 1,
    name: '',
    email: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Formats a number with commas for display.
   * @param {number} number - The number to format.
   * @returns {string} Formatted number or "N/A" if invalid.
   */
  const formatNumberWithCommas = useCallback((number) => {
    if (!Number.isFinite(number) || number <= 0) return 'N/A';
    return Math.round(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }, []);

  /**
   * Validate rideOptionId, ride data, and rideId on mount.
   */
  useEffect(() => {
    console.log('rideOptionId from useParams:', rideOptionId);
    console.log('Ride from state:', ride);
    console.log('rideId from state:', rideId);

    if (!rideOptionId) {
      setError('Invalid ride option ID.');
      navigate('/');
      return;
    }
    if (!rideId) {
      setError('Invalid ride ID.');
      navigate('/');
      return;
    }
    if (!ride || !ride.company || !ride.vehicleType) {
      setError('Ride information is missing.');
      navigate('/');
    }
  }, [rideOptionId, ride, rideId, navigate]);

  /**
   * Parse ride cost from ride data.
   */
  useEffect(() => {
    if (!ride?.cost) {
      setRideCost(0);
      setError('Ride cost information is missing.');
      return;
    }

    const costString = ride.cost;
    const costMatch = costString.match(/(\d[\d,]*)/);
    if (costMatch) {
      const cost = parseInt(costMatch[1].replace(/,/g, ''), 10);
      if (Number.isFinite(cost) && cost > 0) {
        setRideCost(cost);
      } else {
        setRideCost(0);
        setError('Invalid ride cost format.');
      }
    } else {
      setRideCost(0);
      setError('Invalid ride cost format.');
    }
  }, [ride?.cost]);

  /**
   * Fetch number of passengers from Firebase based on rideId.
   */
  useEffect(() => {
    if (!rideId) return;

    const fetchPassengerCount = async () => {
      try {
        const snap = await getDoc(doc(db, 'RideBookings', rideId));
        if (snap.exists()) {
          const numberOfPeople = parseInt(snap.data().userSelection?.numberOfPeople, 10);
          if (Number.isFinite(numberOfPeople)) {
            setFormData((prev) => ({ ...prev, passengers: numberOfPeople }));
          }
        } else {
          setError('Ride booking not found.');
        }
      } catch (err) {
        console.error('Error fetching passenger count:', err);
        setError('Failed to load ride details.');
      }
    };

    fetchPassengerCount();
  }, [rideId]);

  /**
   * Handle form input changes.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Handle form submission to save booking to Firebase and initiate Stripe checkout.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate form data
    if (
      !formData.pickupTime ||
      formData.passengers < 1 ||
      !formData.name ||
      !formData.email ||
      !formData.phone
    ) {
      setError('Please fill in all fields.');
      return;
    }
    if (!rideCost || !Number.isFinite(rideCost) || rideCost <= 0) {
      setError('Invalid ride cost.');
      return;
    }
    if (!rideOptionId || !ride?.company || !rideId) {
      setError('Missing ride or booking information.');
      return;
    }

    setIsLoading(true);
    try {
      if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
        throw new Error('Stripe public key is not configured.');
      }

      const bookingDetails = {
        ride,
        formData,
        rideCost,
        rideOptionId,
        rideId,
        departure,
        destination,
        timestamp: new Date().toISOString(),
      };

      // Save booking to Firebase
      const bookingId = crypto.randomUUID();
      await setDoc(doc(db, 'RideBookings', rideId, 'bookedRides', bookingId), bookingDetails);

      // Save to localStorage for debugging
      try {
        localStorage.setItem('rideBookingDetails', JSON.stringify(bookingDetails));
        console.log('Saved to localStorage:', JSON.parse(localStorage.getItem('rideBookingDetails')));
      } catch (storageError) {
        console.error('Failed to save to localStorage:', storageError);
      }

      const response = await fetch('http://localhost:8000/api/create-ride-checkout-session/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          bookingType: 'ride',
          rideOptionId,
          rideId,
          pickupTime: formData.pickupTime,
          passengers: formData.passengers,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          totalPrice: rideCost,
          company: ride.company,
          vehicleType: ride.vehicleType,
          departure,
          destination,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Error creating checkout session');
      }

      const { id: sessionId } = await response.json();
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to initialize.');
      }

      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });
      if (stripeError) {
        throw new Error(stripeError.message);
      }
    } catch (err) {
      console.error('Payment initiation error:', err);
      setError(`Payment error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Prepare display data
  const company = ride?.company ? String(ride.company) : 'Unknown';
  const vehicleType = ride?.vehicleType ? String(ride.vehicleType) : 'N/A';
  const vehicleModel = ride?.vehicleModel ? String(ride.vehicleModel) : 'N/A';
  const duration = ride?.duration ? String(ride.duration) : 'N/A';
  const distance = ride?.distance ? String(ride.distance) : 'N/A';
  const amenities = ride?.amenities?.length ? ride.amenities.join(', ') : 'None';
  const departureDisplay = departure || 'N/A';
  const destinationDisplay = destination || 'N/A';

  if (!ride || !rideOptionId || !rideId) {
    return (
      <div className="text-center p-4 text-black">
        Loading ride details or invalid ride/booking ID...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto max-w-4xl bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-black mb-6">Book Your Ride with {company}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Ride Details */}
          <div className="space-y-4">
            <div className="bg-white text-black p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-2xl font-bold text-black mb-2">{vehicleType} ({company})</h2>
              <p className="text-gray-600 text-sm mb-1">🚗 Model: {vehicleModel}</p>
              <p className="text-gray-600 text-sm mb-1">📍 From: {departureDisplay}</p>
              <p className="text-gray-600 text-sm mb-1">📍 To: {destinationDisplay}</p>
              <p className="text-sm font-medium text-black mb-1">⏰ Duration: {duration}</p>
              <p className="text-sm font-medium text-black mb-1">📏 Distance: {distance}</p>
              <p className="text-sm font-medium text-black mb-1">🛠️ Amenities: {amenities}</p>
              <p className="text-sm font-semibold text-black">
                💰 Rs. {formatNumberWithCommas(rideCost)}
              </p>
            </div>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black">Pickup Time</label>
              <input
                type="datetime-local"
                name="pickupTime"
                value={formData.pickupTime}
                onChange={handleInputChange}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">Number of Passengers</label>
              <div className="flex flex-col">
                <input
                  type="number"
                  name="passengers"
                  value={formData.passengers}
                  onChange={handleInputChange}
                  min="1"
                  max={ride.vehicleType.toLowerCase() === 'sedan' ? 4 : ride.vehicleType.toLowerCase() === 'suv' ? 7 : ride.vehicleType.toLowerCase() === 'van' ? 12 : 4}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500"
                  required
                />
                {rideId && (
                  <p className="text-xs text-gray-500 mt-1">
                    Pre-filled from your ride details
                  </p>
                )}
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
            {rideCost > 0 && (
              <div className="mt-6 p-5 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-bold text-lg text-black mb-2">Booking Summary</h3>
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-sm text-black">Company:</p>
                  <p className="text-sm font-medium text-right text-black">{company}</p>
                  <p className="text-sm text-black">Vehicle:</p>
                  <p className="text-sm font-medium text-right text-black">{vehicleType} ({vehicleModel})</p>
                  <p className="text-sm text-black">Passengers:</p>
                  <p className="text-sm font-medium text-right text-black">
                    {formData.passengers} {formData.passengers === 1 ? 'Person' : 'People'}
                  </p>
                  <p className="text-sm text-black">Total Price:</p>
                  <p className="text-sm font-bold text-right text-black">
                    Rs. {formatNumberWithCommas(rideCost)}
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
              {isLoading ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RideBookingPage;