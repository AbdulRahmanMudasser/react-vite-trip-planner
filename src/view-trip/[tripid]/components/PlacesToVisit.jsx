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
          // Use the first photo to avoid index out of bounds
          const photoName = place.photos[0]?.name; // Changed from [3] to [0] for safety
          if (photoName) {
            const photoUrl = PHOTO_REF_URL.replace("{NAME}", photoName);
            setPhotoUrls((prev) => ({
              ...prev,
              [placeName]: photoUrl, // Store photo URL with placeName as key
            }));
          }
        }
      }
    } catch (error) {
      console.error(`Error fetching photo for ${placeName}:`, error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-5">
      <h2 className="font-bold text-xl mt-1">🏨 Places To Visit</h2>
      {trip?.tripData?.itinerary &&
        Object.entries(trip.tripData.itinerary)
          .sort(([a], [b]) => Number(a.replace("day", "")) - Number(b.replace("day", ""))) // Sorting days
          .map(([dayKey, dayData], index) => (
            <div key={index} className="mb-10">
              {/* Day Heading */}
              <h2 className="text-2xl font-bold text-blue-600 mb-4">
                {`Day ${index + 1} - ${dayData.theme}`}
              </h2>

              {/* Flexbox for Activities */}
              <div className="flex flex-wrap gap-6">
                {Array.isArray(dayData.activities) &&
                  dayData.activities.map((activity, idx) => (
                    <div key={idx} className="w-full md:w-[48%]">
                      {/* Time Slot - Fixed on Top of Card */}
                      <p className="text-sm text-gray-600 font-bold mb-2 uppercase">
                        {activity.details?.timeSlot}
                        {console.log("Time Slot:", activity.details?.timeSlot)}
                      </p>

                      {/* Activity Card */}
                      <div className="flex bg-white shadow-lg rounded-lg overflow-hidden transition-transform duration-300 transform hover:scale-105 hover:shadow-xl p-4">
                        {/* Image */}
                        {(activity.placeImageURL || photoUrls[activity.placeName]) && (
                          <img
                            src={photoUrls[activity.placeName] || activity.placeImageURL || "https://via.placeholder.com/300x200"}
                            alt={activity.placeName}
                            className="w-1/3 h-40 object-cover rounded-md"
                          />
                        )}

                        {/* Details */}
                        <div className="w-2/3 pl-4 flex flex-col justify-center">
                          <h3 className="font-semibold text-lg text-gray-800">
                            {activity.time}
                          </h3>
                          <h3 className="font-semibold text-lg text-gray-800">
                            {activity.placeName}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {activity.placeDetails}
                          </p>

                          <p className="text-sm mt-2">
                            <strong>Best Time To Visit:</strong> {activity.bestTimeToVisit}
                          </p>
                          <p className="text-sm">
                            <strong>Ticket Pricing:</strong> {activity.ticketPricing || "Free"}
                          </p>
                          <p className="text-sm mt-2">
                            <strong>Time To Travel:</strong> {activity.travelTimeFromHotel}
                          </p>
                          <p className="text-sm">
                            <strong>Rating:</strong> ⭐ {activity.rating || "N/A"}
                          </p>

                          {/* Corrected Link Placement */}
                          {activity.placeName && (
                            <Link
                              to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                activity.placeName
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline mt-2"
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