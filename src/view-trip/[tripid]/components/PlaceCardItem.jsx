// import { GetPlaceDetails, PHOTO_REF_URL } from "@/service/GlobalApi";
// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";

// function PlaceCardItem({ place }) {
//     const [placeData, setPlaceData] = useState(null);
        
//         const [photoUrl,setPhotoUrl]=useState();
//         useEffect(() => {
//             if (trip) {
//                 GetPlacePhoto();
//             }
//         }, [trip]);
        
//         const GetPlacePhoto = async () => {
//             try {
//                 const data = { textQuery: trip?.userSelection?.destination };
//                 const response = await GetPlaceDetails(data);
//                 console.log(response.data.places[0].photos[4].name); // Check API Response
    
//                 const PhotoUrl=PHOTO_REF_URL.replace('{NAME}', response.data.places[0].photos[3].name);
//                 setPhotoUrl(PhotoUrl);
    
//                 if (response?.data?.places?.length > 0) {
//                     setPlaceData(response.data.places[0]); // Store first result
//                 }
//             } catch (error) {
//                 console.error("Error fetching place details:", error);
//             }
//         };

//     return (
//         <Link
//             to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place?.placeName)},${encodeURIComponent(place?.placeAddress)}`}
//             target="_blank"
//         >
//             <div className="hover:scale-105 transition-all cursor-pointer">
//                 <img
//                     src={photoUrl || place?.placeImageURL || "/fallback-image.jpg"}
//                     className="rounded-xl w-full h-48 object-cover"
//                     alt={place?.placeName || "Place Image"}
//                 />
//                 <div className="my-2 flex flex-col gap-2">
//                     <h2 className="font-medium">{place?.placeName || "Unknown Place"}</h2>
//                     <h2 className="text-xs text-gray-500">📍 {place?.placeAddress || "No address available"}</h2>
//                     <h2 className="text-sm">⭐ {place?.rating ?? "N/A"}</h2>
//                     <h2 className="text-sm">⏰ Best Time: {place?.bestTimeToVisit || "N/A"}</h2>
//                 </div>
//             </div>
//         </Link>
//     );
// }

// export default PlaceCardItem;
