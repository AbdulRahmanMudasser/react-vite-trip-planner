import { GetPlaceDetails, PHOTO_REF_URL } from "@/service/GlobalApi";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Correct import for Link

const TripItinerary = ({ trip }) => {
    const [placeData, setPlaceData] = useState(null);
        
        const [photoUrl,setPhotoUrl]=useState();
        useEffect(() => {
            if (trip?.tripData?.itinerary) {
                GetPlacePhoto();
            }
        }, [trip]);
        
        
        const GetPlacePhoto = async () => {
            try {
                const data = { textQuery: activity.placeName};
                const response = await GetPlaceDetails(data);
    
                const PhotoUrl=PHOTO_REF_URL.replace('{NAME}', response.data.places[0].photos[3].name);
                setPhotoUrl(PhotoUrl);
    
                if (response?.data?.places?.length > 0) {
                    setPlaceData(response.data.places[0]); // Store first result
                }
            } catch (error) {
                console.error("Error fetching place details:", error);
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
                      {/* Time Slot - Now Fixed on Top of Card */}
                      <p className="text-sm text-gray-600 font-bold mb-2 uppercase">
                        {activity.details?.timeSlot}
                        {console.log("Time Slot:", activity.details?.timeSlot)}
                      </p>

                      {/* Activity Card */}
                      <div className="flex bg-white shadow-lg rounded-lg overflow-hidden transition-transform duration-300 transform hover:scale-105 hover:shadow-xl p-4">
                        {/* Image */}
                        {activity.placeImageURL && (
                          <img
                            src={photoUrl}
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
