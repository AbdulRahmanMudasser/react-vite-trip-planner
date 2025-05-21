import React, { useEffect } from 'react';
import { db } from '@/service/firebaseConfig'
import { collection, addDoc } from 'firebase/firestore';

const SuccessPage = () => {
    useEffect(() => {
        const bookingDetails = JSON.parse(localStorage.getItem('bookingDetails'));
        if (bookingDetails) {
            const { hotel, formData, totalPrice } = bookingDetails;
            addDoc(collection(db, "bookings"), {
                hotelId: hotel.tripId,
                hotelName: hotel.hotelName,
                checkIn: formData.checkIn,
                checkOut: formData.checkOut,
                guests: formData.guests,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                totalPrice,
                timestamp: new Date(),
            })
            .then(() => {
                console.log("Booking saved to Firebase");
                localStorage.removeItem('bookingDetails');
            })
            .catch((error) => console.error("Error saving booking:", error));
        }
    }, []);

    return (
        <div className="text-center p-8">
            <h1 className="text-2xl font-bold">Booking Successful!</h1>
            <p>Your booking has been confirmed. Thank you for choosing us!</p>
        </div>
    );
};

export default SuccessPage;