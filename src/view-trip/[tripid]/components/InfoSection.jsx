import React, { useEffect, useState } from 'react'
import { IoIosSend } from "react-icons/io";
import { Button } from '@/components/ui/button';
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';



function InfoSection({ trip }) {
    const [placeData, setPlaceData] = useState(null);

    const [photoUrl, setPhotoUrl] = useState();
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

            const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', response.data.places[0].photos[3].name);
            setPhotoUrl(PhotoUrl);

            if (response?.data?.places?.length > 0) {
                setPlaceData(response.data.places[0]); // Store first result
            }
        } catch (error) {
            console.error("Error fetching place details:", error);
        }
    };
    return (
        <div className='max-w-6xl mx-auto p-10'>
            <img src={photoUrl} alt="" />
            <div className='flex justify-between items-center  mx-auto'>
                <div className='my-5 flex flex-col gap-2'>
                    <h2 className='font-bold text-2xl'>{trip?.userSelection?.destination}</h2>
                    <div className='flex gap-5'>
                        <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>
                            📅 {trip?.userSelection?.days} Days
                        </h2>
                        <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>
                            💰 {trip?.userSelection?.budget} Budget
                        </h2>
                        <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>
                            🥂 Companion Type: {trip?.userSelection?.companion}
                        </h2>
                        <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>
                            🧑‍🤝‍🧑 No. of Travelers: {trip?.userSelection?.numberOfPeople}
                        </h2>
                    </div>
                </div>
                <Button><IoIosSend /></Button>
            </div>
        </div>
    )
}

export default InfoSection