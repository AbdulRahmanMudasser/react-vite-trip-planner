import { GetPlaceDetails, PHOTO_REF_URL } from "@/service/GlobalApi";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function HotelCardItem({ hotel }) {
    const [photoUrl, setPhotoUrl] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (hotel && !photoUrl) {
            GetPlacePhoto();
        }
    }, [hotel]);

    const GetPlacePhoto = async () => {
        try {
            if (!hotel?.hotelName) return;

            const response = await GetPlaceDetails({ textQuery: hotel.hotelName });

            if (response?.data?.places?.length > 0) {
                const place = response.data.places[0];
                if (place?.photos?.length > 0) {
                    const photoName = place.photos[0]?.name;
                    if (photoName) {
                        setPhotoUrl(PHOTO_REF_URL.replace("{NAME}", photoName));
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching place details:", error);
        }
    };

    const handleBookNow = () => {
        navigate(`/book-hotel/${hotel.id}`, { state: { hotel } });
    };

    return (
        <div className="hover:scale-105 transition-all cursor-pointer">
            <a
                href={`https://www.google.com/maps/search/?api=1&query=${hotel?.hotelName},${hotel?.hotelAddress}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                <img
                    src={photoUrl || hotel?.hotelImageURL}
                    className="rounded-xl w-full h-48 object-cover"
                    alt={hotel?.hotelName}
                />
            </a>
            <div className="my-2 flex flex-col gap-2">
                <h2 className="font-medium">{hotel?.hotelName}</h2>
                <h2 className="text-xs text-gray-500">📍 {hotel?.hotelAddress}</h2>
                <h2 className="text-sm">💰 {hotel?.price}</h2>
                <h2 className="text-sm">⭐ {hotel?.rating}</h2>
                <button
                    onClick={handleBookNow}
                    className="bg-black text-white px-4 py-2 rounded-lg hover:bg-black-50 transition-colors"
                >
                    Book Now
                </button>
            </div>
        </div>
    );
}

export default HotelCardItem;