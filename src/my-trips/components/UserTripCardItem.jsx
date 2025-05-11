import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router';

function UserTripCardItem({ trip }) {

  const [placeData, setPlaceData] = useState(null);
      
      const [photoUrl,setPhotoUrl]=useState();
      useEffect(() => {
          if (trip) {
              GetPlacePhoto();
          }
      }, [trip]);
      
      const GetPlacePhoto = async () => {
          try {
              const data = { textQuery: trip?.userSelection?.destination };
              const response = await GetPlaceDetails(data);
              console.log(response.data.places[0].photos[4].name); // Check API Response
  
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
    <Link to = {'/view-trip/'+trip?.id}>
    <div className="border p-4 rounded-lg shadow-md hover:scale-105 transition-all hover:shadow-md">
      <img src={photoUrl} alt="Trip" className="object-cover rounded-xl w-full h-32" />
      <div className="mt-2">
        {trip?.userSelection ? (
            <div>
                <h2 className="font-bold text-lg">{trip.userSelection.destination}</h2>
                <h2 className='text-sm text-gray-500'>{trip?.userSelection?.days} Days trip with {trip?.userSelection?.budget} Budget</h2>            
            </div>
        ) : (
          <h2 className="text-lg text-gray-500">No Destination Found</h2>

        )}
      </div>
    </div>
    </Link>
  );
}

export default UserTripCardItem;
