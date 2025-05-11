import React from 'react';
// import { Link } from 'react-router';
import HotelCardItem from './HotelCardItem';

function Hotels({ trip }) {
  return (
    <div className='max-w-6xl mx-auto p-5'>
      <h2 className="font-bold text-xl mt-1">🏨 Hotel Recommendation</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
        {trip?.tripData?.hotelOptions?.map((hotel, index) => (
          <HotelCardItem key={hotel.id || index} hotel={hotel} />
          
        ))}
      </div>
    </div>
  );
}

export default Hotels;
