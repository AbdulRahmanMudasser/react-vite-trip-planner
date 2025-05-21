// src/components/Services.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { toast } from 'react-hot-toast';
import { rideChatSession } from '@/service/AIModel';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/service/firebaseConfig';

function RideCard({ ride, onBook }) {
  if (ride.type === 'warning') {
    return (
      <div className="hover:scale-105 transition-all cursor-default bg-white border border-gray-200 rounded-xl shadow-md p-4">
        <div className="flex flex-col gap-2">
          <h2 className="font-medium text-lg text-black">⚠️ {ride.title}</h2>
          <p className="text-sm text-gray-500">{ride.message}</p>
          <p className="text-sm text-gray-500">⏰ {ride.duration || 'N/A'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="hover:scale-105 transition-all cursor-pointer bg-white border border-gray-200 rounded-xl shadow-md p-4">
      <div className="flex flex-col gap-2">
        <h2 className="font-medium text-lg text-black">{ride.vehicleType} ({ride.company})</h2>
        <p className="text-sm text-gray-500">🚗 Model: {ride.vehicleModel || 'N/A'}</p>
        <p className="text-sm text-gray-500">💰 {ride.cost}</p>
        <p className="text-sm text-gray-500">⏰ Duration: {ride.duration}</p>
        <p className="text-sm text-gray-500">📏 Distance: {ride.distance || 'N/A'}</p>
        <p className="text-sm text-gray-500">🕒 Est. Arrival: {ride.estimatedArrivalTime || 'N/A'}</p>
        <p className="text-sm text-gray-500">🛠️ Amenities: {ride.amenities?.join(', ') || 'None'}</p>
        <Button
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 hover:text-white text-center mt-2"
          onClick={() => onBook(ride)}
        >
          Book This Ride
        </Button>
      </div>
    </div>
  );
}

function Services() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    departureLocation: null,
    destination: null,
    numberOfPeople: '1',
    budget: '',
    preferredVehicle: 'any',
    rideId: '',
  });
  const [rideOptions, setRideOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const onFindRides = async () => {
    if (!formData.departureLocation?.label || !formData.destination?.label) {
      toast('Please provide departure and destination details.');
      return;
    }

    const numberOfPeople = parseInt(formData.numberOfPeople);
    if (isNaN(numberOfPeople) || numberOfPeople <= 0) {
      toast('Please enter a valid number of people.');
      return;
    }

    const budgetValue = parseFloat(formData.budget);
    if (formData.budget && (isNaN(budgetValue) || budgetValue <= 0)) {
      toast('Please enter a valid budget amount.');
      return;
    }

    const validVehicles = ['any', 'sedan', 'suv', 'van', 'luxury'];
    if (!validVehicles.includes(formData.preferredVehicle)) {
      toast('Please select a valid vehicle type.');
      return;
    }

    setLoading(true);

    // Generate rideId and save to Firebase
    const rideId = crypto.randomUUID();
    try {
      await setDoc(doc(db, 'ride-bookings', rideId), {
        departure: formData.departureLocation.label,
        destination: formData.destination.label,
        numberOfPeople: numberOfPeople,
        timestamp: new Date().toISOString(),
        userSelection: {
          numberOfPeople,
          budget: formData.budget || 'unlimited',
          preferredVehicle: formData.preferredVehicle,
        },
      });
      setFormData((prev) => ({ ...prev, rideId }));
    } catch (error) {
      console.error('Error saving ride to Firebase:', error);
      toast('Failed to save ride details. Please try again.');
      setLoading(false);
      return;
    }

    const RIDE_PROMPT = `
      Suggest ride options for a trip from {departure} to {destination} for {numberOfPeople} people with a budget of {budget} PKR and preferred vehicle type {preferredVehicle}, in Pakistan as of May 22, 2025, 12:15 AM PKT.
      - For valid rides, return a JSON array of objects with:
        - "company": Ride-sharing company (e.g., Careem, inDrive, Uber).
        - "vehicleType": Type of vehicle (e.g., Sedan, SUV, Van, Luxury).
        - "vehicleModel": Specific model (e.g., Toyota Corolla, Honda CR-V).
        - "cost": Cost in PKR (e.g., "1500 PKR").
        - "duration": Estimated travel time (e.g., "45 minutes").
        - "distance": Distance in kilometers (e.g., "30 km").
        - "estimatedArrivalTime": Estimated arrival time based on current time (12:15 AM PKT, e.g., "1:00 AM PKT").
        - "amenities": Array of amenities (e.g., ["AC", "Wi-Fi"]).
      - Consider realistic pricing and durations based on the distance between {departure} and {destination}, using Pakistan's ride-sharing market (Careem, inDrive, Uber).
      - If the budget is too low (less than Rs. 750 per person), the number of people exceeds vehicle capacity (more than 4 for sedan, 7 for SUV, 12 for van, 4 for luxury), or any input is invalid (e.g., negative budget, invalid vehicle type, unrealistic locations), return a JSON array with a single object: {"type": "warning", "title": "appropriate title", "message": "detailed professional message explaining the issue", "duration": "N/A"}.
      - Do not include any additional text, markdown (e.g., \`\`\`json), or explanations outside the JSON array.
    `;

    const finalPrompt = RIDE_PROMPT
      .replace('{departure}', formData.departureLocation.label)
      .replace('{destination}', formData.destination.label)
      .replace('{numberOfPeople}', formData.numberOfPeople || '1')
      .replace('{budget}', formData.budget || 'unlimited')
      .replace('{preferredVehicle}', formData.preferredVehicle || 'any');

    try {
      const result = await rideChatSession.sendMessage(finalPrompt);
      const rideText = result.response.text().replace(/```json\n|\n```|```/g, '').trim();
      let rideData;
      try {
        rideData = JSON.parse(rideText);
      } catch (e) {
        throw new Error('Invalid JSON response from Gemini');
      }
      if (Array.isArray(rideData)) {
        const ridesWithIds = rideData.map((ride) => ({
          ...ride,
          rideOptionId: crypto.randomUUID(), // Unique ID for each ride option
          rideId, // Associate with search session
        }));
        setRideOptions(ridesWithIds);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching ride options:', error);
      toast('Failed to fetch ride options. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookRide = (ride) => {
    navigate(`/ride-booking/${ride.rideOptionId}`, {
      state: {
        ride,
        rideId: formData.rideId,
        departure: formData.departureLocation.label,
        destination: formData.destination.label,
      },
    });
  };

  return (
    <div className="services-section max-w-4xl mx-auto p-5">
      <h2 className="text-2xl font-bold text-black mb-6">Book a Ride</h2>
      <div className="flex flex-col gap-6 bg-white p-6 rounded-xl shadow-md border border-gray-200">
        {/* Departure Location */}
        <div>
          <h3 className="text-xl font-medium text-black mb-2">Where are you departing from?</h3>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACE_KEY}
            selectProps={{
              value: formData.departureLocation,
              onChange: (place) => handleInputChange('departureLocation', place),
              isClearable: true,
              placeholder: 'Enter departure location...',
              className: 'text-black',
            }}
            options={{
              types: ['geocode'],
            }}
          />
        </div>
        {/* Destination */}
        <div>
          <h3 className="text-xl font-medium text-black mb-2">Where are you going?</h3>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACE_KEY}
            selectProps={{
              value: formData.destination,
              onChange: (place) => handleInputChange('destination', place),
              isClearable: true,
              placeholder: 'Enter destination...',
              className: 'text-black',
            }}
            options={{
              types: ['geocode'],
            }}
          />
        </div>
        {/* Number of People */}
        <div>
          <h3 className="text-xl font-medium text-black mb-2">Number of People</h3>
          <input
            type="number"
            min="1"
            value={formData.numberOfPeople}
            onChange={(e) => handleInputChange('numberOfPeople', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-800"
            placeholder="Enter number of people"
          />
        </div>
        {/* Budget */}
        <div>
          <h3 className="text-xl font-medium text-black mb-2">Budget (PKR)</h3>
          <input
            type="text"
            value={formData.budget}
            onChange={(e) => handleInputChange('budget', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-800"
            placeholder="Enter your budget (e.g., Rs. 750 per person)"
          />
        </div>
        {/* Preferred Vehicle */}
        <div>
          <h3 className="text-xl font-medium text-black mb-2">Preferred Vehicle Type</h3>
          <select
            value={formData.preferredVehicle}
            onChange={(e) => handleInputChange('preferredVehicle', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-800"
          >
            <option value="any">Any</option>
            <option value="sedan">Sedan</option>
            <option value="suv">SUV</option>
            <option value="van">Van</option>
            <option value="luxury">Luxury</option>
          </select>
        </div>
        {/* Find Rides Button */}
        <Button
          onClick={onFindRides}
          disabled={loading}
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 hover:text-white text-center w-full md:w-auto"
        >
          {loading ? 'Finding Rides...' : 'Find Rides'}
        </Button>
      </div>
      {/* Ride Options */}
      <div className="ride-options grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {rideOptions.length > 0 ? (
          rideOptions.map((ride, index) => (
            <RideCard key={ride.rideOptionId} ride={ride} onBook={handleBookRide} />
          ))
        ) : (
          !loading && <p className="text-gray-500">No ride options available yet. Click "Find Rides" to search.</p>
        )}
      </div>
    </div>
  );
}

export default Services;