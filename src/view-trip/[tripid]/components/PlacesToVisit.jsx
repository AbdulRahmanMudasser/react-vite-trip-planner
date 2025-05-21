// src/components/TripItinerary.jsx
import { GetPlaceDetails, PHOTO_REF_URL } from "@/service/GlobalApi";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const TripItinerary = ({ trip }) => {
  const [photoUrls, setPhotoUrls] = useState({}); // State to store photo URLs per activity

  useEffect(() => {
    if (trip?.tripData?.itinerary) {
      // Fetch photos for each activity
      Object.values(trip.tripData.itinerary).forEach((day) => {
        day.activities.forEach((activity) => {
          if (activity.placeName) {
            GetPlacePhoto(activity.placeName);
          }
        });
      });
    }
  }, [trip]);

  const GetPlacePhoto = async (placeName) => {
    try {
      const data = { textQuery: placeName };
      const response = await GetPlaceDetails(data);

      if (response?.data?.places?.length > 0) {
        const place = response.data.places[0];
        if (place?.photos?.length > 0) {
          const photoName = place.photos[0]?.name; // Use first photo for safety
          if (photoName) {
            const photoUrl = PHOTO_REF_URL.replace("{NAME}", photoName);
            setPhotoUrls((prev) => ({
              ...prev,
              [placeName]: photoUrl,
            }));
          }
        }
      }
    } catch (error) {
      console.error(`Error fetching photo for ${placeName}:`, error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-10">
      <h2 className="font-bold text-2xl text-black mb-6">🏨 Places To Visit</h2>
      {trip?.tripData?.itinerary &&
        Object.entries(trip.tripData.itinerary)
          .sort(([a], [b]) => Number(a.replace("day", "")) - Number(b.replace("day", "")))
          .map(([dayKey, dayData], index) => (
            <div key={index} className="mb-10">
              {/* Day Heading */}
              <h2 className="text-xl font-bold text-black mb-4">
                {`Day ${index + 1} - ${dayData.theme}`}
              </h2>

              {/* Flexbox for Activities */}
              <div className="flex flex-wrap gap-6">
                {Array.isArray(dayData.activities) &&
                  dayData.activities.map((activity, idx) => (
                    <div key={idx} className="w-full md:w-[48%]">

                      {/* Activity Card */}
                      <div className="flex bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden transition-transform duration-300 transform hover:scale-105 p-4">
                        {/* Image */}
                        {(activity.placeImageURL || photoUrls[activity.placeName]) && (
                          <img
                            src={photoUrls[activity.placeName] || activity.placeImageURL || "https://via.placeholder.com/300x200"}
                            alt={activity.placeName}
                            className="w-1/3 h-40 object-cover rounded-md"
                          />
                        )}

                        {/* Details */}
                        <div className="w-2/3 pl-4 flex flex-col justify-center gap-2">
                          <h3 className="font-medium text-lg text-black">
                            📍 {activity.placeName}
                          </h3>
                          <p className="text-gray-500 text-sm">
                            {activity.placeDetails || "No details available"}
                          </p>
                          <p className="text-sm text-gray-500">
                            <strong>Best Time To Visit:</strong> {activity.bestTimeToVisit || "Any time"}
                          </p>
                          <p className="text-sm text-gray-500">
                            <strong>Ticket Pricing:</strong> 💰 {activity.ticketPricing || "Free"}
                          </p>
                          <p className="text-sm text-gray-500">
                            <strong>Time To Travel:</strong> 🚗 {activity.travelTimeFromHotel || "N/A"}
                          </p>
                          <p className="text-sm text-gray-500">
                            <strong>Rating:</strong> ⭐ {activity.rating || "N/A"}
                          </p>
                          {activity.placeName && (
                            <Link
                              to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                activity.placeName
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 hover:text-white text-center text-sm mt-2"
                            >
                              View on Google Maps
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
    </div>
  );
};

export default TripItinerary; 