import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/service/firebaseConfig';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, MapPin, Car, Hotel, Calendar, Users, DollarSign, BarChart2, Bell, Plus } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [rideBookings, setRideBookings] = useState([]);
    const [hotelBookings, setHotelBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({
        totalTrips: 0,
        totalRideBookings: 0,
        totalHotelBookings: 0,
        totalBudgetSpent: 0,
        upcomingTrips: 0,
    });
    // Track image loading states for trips and hotel bookings
    const [tripImageLoading, setTripImageLoading] = useState({});
    const [hotelImageLoading, setHotelImageLoading] = useState({});

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-PK', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            timeZone: 'Asia/Karachi',
        });
    };

    // Format PKR currency
    const formatCurrency = (amount) => {
        if (!amount || !Number.isFinite(parseFloat(amount)) || parseFloat(amount) <= 0) return 'N/A';
        return `PKR ${parseFloat(amount).toLocaleString('en-PK')}`;
    };

    // Calculate statistics
    const calculateStats = (tripsData, rideBookingsData, hotelBookingsData) => {
        const totalTrips = tripsData.length;
        const totalRideBookings = rideBookingsData.length;
        const totalHotelBookings = hotelBookingsData.length;

        let totalBudgetSpent = 0;
        totalBudgetSpent += hotelBookingsData.reduce((sum, booking) => sum + (parseFloat(booking.totalPrice) || 0), 0);
        totalBudgetSpent += rideBookingsData.reduce((sum, ride) => sum + (parseFloat(ride.userSelection?.budget) || 0), 0);
        totalBudgetSpent += tripsData.reduce((sum, trip) => sum + (trip.budget === 'Luxury' ? 50000 : 0), 0);

        const today = new Date('2025-05-22');
        const upcomingTrips = tripsData.filter(trip => {
            const firstActivityDate = trip.itinerary?.day1?.activities?.[0]?.placeDetails?.includes('2025')
                ? new Date(trip.itinerary.day1.activities[0].placeDetails.match(/\d{4}-\d{2}-\d{2}/)?.[0])
                : null;
            return firstActivityDate && firstActivityDate > today;
        }).length;

        return {
            totalTrips,
            totalRideBookings,
            totalHotelBookings,
            totalBudgetSpent,
            upcomingTrips,
        };
    };

    // Fetch all data from Firebase
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                const tripsSnapshot = await getDocs(collection(db, 'AITrips'));
                const tripsData = tripsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                const rideBookingsSnapshot = await getDocs(collection(db, 'ride-bookings'));
                const rideBookingsData = rideBookingsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                const hotelBookingsSnapshot = await getDocs(collection(db, 'bookings'));
                const hotelBookingsData = hotelBookingsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                const calculatedStats = calculateStats(tripsData, rideBookingsData, hotelBookingsData);
                setStats(calculatedStats);

                // Initialize image loading states
                const tripImageLoadingInit = {};
                tripsData.forEach(trip => {
                    tripImageLoadingInit[trip.id] = true;
                });
                setTripImageLoading(tripImageLoadingInit);

                const hotelImageLoadingInit = {};
                hotelBookingsData.forEach(booking => {
                    hotelImageLoadingInit[booking.id] = true;
                });
                setHotelImageLoading(hotelImageLoadingInit);

                setTrips(tripsData);
                setRideBookings(rideBookingsData);
                setHotelBookings(hotelBookingsData);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to load dashboard data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Navigate to trip details
    const handleViewTrip = (tripId) => {
        navigate(`/view-trip/${tripId}`);
    };

    // Navigate to ride booking details
    const handleViewRide = (rideId) => {
        navigate(`/ride-booking/${rideId}`, {
            state: { rideId },
        });
    };

    // Navigate to hotel booking details
    const handleViewHotel = (hotelId) => {
        navigate(`/book-hotel/${hotelId}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="bg-black/50 p-4">
                    <Loader2 className="h-10 w-10 text-white animate-spin" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="bg-red-100 p-4 border border-red-500">
                    <p className="text-red-700 text-sm font-semibold">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white py-6 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2210%22 height=%2210%22 viewBox=%220 0 10 10%22%3E%3Crect width=%2210%22 height=%2210%22 fill=%22none%22/%3E%3Cpath d=%22M0 5 H10 M5 0 V10%22 stroke=%22%23e5e5e5%22 stroke-width=%221%22/%3E%3C/svg%3E')] flex font-[Poppins, sans-serif]">
            {/* Sidebar */}
            <div className="w-64 bg-gray-100 p-4 border-r-1 border-black">
                <h3 className="text-base font-bold text-black mb-4">Quick Actions</h3>
                <Link to="/create-trip">
                    <Button className="w-full mb-2 bg-black text-white hover:bg-gray-800 transition-all duration-300 py-2 rounded flex items-center justify-center">
                        <Plus className="h-4 w-4 mr-2" /> Add New Trip
                    </Button>
                </Link>
                <Button className="w-full bg-black text-white hover:bg-gray-800 transition-all duration-300 py-2 rounded flex items-center justify-center">
                    <BarChart2 className="h-4 w-4 mr-2" /> View Reports
                </Button>
                <div className="mt-6">
                    <h3 className="text-base font-bold text-black mb-2">Notifications</h3>
                    <div className="bg-white p-2 border-2 border-gray-300">
                        <p className="text-xs text-gray-700 flex items-center"><Bell className="h-3 w-3 mr-1" /> New booking confirmed for Avari Lahore.</p>
                        <p className="text-xs text-gray-700 flex items-center"><Bell className="h-3 w-3 mr-1" /> Ride to Lahore scheduled for May 23.</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-2">
                <div className="bg-black text-white p-4 mb-4 flex items-center justify-between rounded">
                    <h1 className="text-xl font-bold tracking-wide">My Travel Dashboard</h1>
                    <MapPin className="h-6 w-6" />
                </div>

                {/* Statistics Section */}
                <div className="mb-6">
                    <div className="border-2 border-black rounded">
                        <div className="bg-black text-white p-3">
                            <h2 className="text-xl font-bold flex items-center">
                                <BarChart2 className="h-5 w-5 mr-2" />
                                Travel Statistics
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-white">
                            <div className="flex items-center p-2 border-2 border-gray-300 rounded">
                                <MapPin className="h-6 w-6 mr-2 text-black" />
                                <div>
                                    <p className="text-sm font-bold text-black">Total Trips</p>
                                    <p className="text-base font-medium text-gray-800">{stats.totalTrips}</p>
                                </div>
                            </div>
                            <div className="flex items-center p-2 border-2 border-gray-300 rounded">
                                <Car className="h-6 w-6 mr-2 text-black" />
                                <div>
                                    <p className="text-sm font-bold text-black">Total Ride Bookings</p>
                                    <p className="text-base font-medium text-gray-800">{stats.totalRideBookings}</p>
                                </div>
                            </div>
                            <div className="flex items-center p-2 border-2 border-gray-300 rounded">
                                <Hotel className="h-6 w-6 mr-2 text-black" />
                                <div>
                                    <p className="text-sm font-bold text-black">Total Hotel Bookings</p>
                                    <p className="text-base font-medium text-gray-800">{stats.totalHotelBookings}</p>
                                </div>
                            </div>
                            <div className="flex items-center p-2 border-2 border-gray-300 rounded">
                                <DollarSign className="h-6 w-6 mr-2 text-black" />
                                <div>
                                    <p className="text-sm font-bold text-black">Total Budget Spent</p>
                                    <p className="text-base font-medium text-gray-800">{formatCurrency(stats.totalBudgetSpent)}</p>
                                </div>
                            </div>
                            <div className="flex items-center p-2 border-2 border-gray-300 rounded">
                                <Calendar className="h-6 w-6 mr-2 text-black" />
                                <div>
                                    <p className="text-sm font-bold text-black">Upcoming Trips</p>
                                    <p className="text-base font-medium text-gray-800">{stats.upcomingTrips}</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-gray-600 p-2">Last Updated: 04:20 AM PKT, May 22, 2025</p>
                    </div>
                </div>

                <Accordion type="single" collapsible className="space-y-3">
                    {/* Trips Section */}
                    <AccordionItem value="trips">
                        <AccordionTrigger className="text-xl font-bold text-black bg-gray-100 px-3 py-2">
                            <span className="flex items-center">
                                <MapPin className="h-5 w-5 mr-2" />
                                Trips ({trips.length})
                            </span>
                        </AccordionTrigger>
                        <AccordionContent className="p-3 bg-white">
                            {trips.length === 0 ? (
                                <p className="text-gray-600 text-sm">No trips found.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {trips.map((trip) => (
                                        <Card key={trip.id} className="border-1 border-black">
                                            <CardHeader className="bg-gray-50 p-2">
                                                <CardTitle className="text-base font-bold text-black flex items-center">
                                                    <MapPin className="h-4 w-4 mr-1" />
                                                    {trip.tripData.tripName || 'Untitled Trip'}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-2 space-y-1">
                                                {trip.hotelOptions?.[0]?.hotelImageURL && (
                                                    <div className="relative">
                                                        {tripImageLoading[trip.id] && (
                                                            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                                                                <Loader2 className="h-6 w-6 text-black animate-spin" />
                                                            </div>
                                                        )}
                                                        <img
                                                            src={trip.hotelOptions[0].hotelImageURL}
                                                            alt={trip.hotelOptions[0].hotelName || 'Hotel'}
                                                            className="w-full h-20 object-cover"
                                                            onLoad={() => setTripImageLoading(prev => ({ ...prev, [trip.id]: false }))}
                                                            onError={() => setTripImageLoading(prev => ({ ...prev, [trip.id]: false }))}
                                                        />
                                                    </div>
                                                )}
                                                <p className="text-xs text-gray-700 flex items-center">
                                                    <DollarSign className="h-3 w-3 mr-1" />
                                                    <span className="font-medium">Budget: </span> {trip.tripData.budget || 'N/A'}
                                                </p>
                                                <p className="text-xs text-gray-700 flex items-center">
                                                    <Calendar className="h-3 w-3 mr-1" />
                                                    <span className="font-medium">Duration: </span> {trip.tripData.duration || 'N/A'}
                                                </p>
                                                <p className="text-xs text-gray-700 flex items-center">
                                                    <MapPin className="h-3 w-3 mr-1" />
                                                    <span className="font-medium">Location: </span> {trip.tripData.location || 'N/A'}
                                                </p>
                                                <p className="text-xs text-gray-700 flex items-center">
                                                    <Users className="h-3 w-3 mr-1" />
                                                    <span className="font-medium">Travelers: </span> {trip.tripData.travelers || 'N/A'}
                                                </p>
                                                <p className="text-xs text-gray-700 flex items-center">
                                                    <Users className="h-3 w-3 mr-1" />
                                                    <span className="font-medium">Email: </span> {trip.userEmail || 'N/A'}
                                                </p>
                                                <Button
                                                    onClick={() => handleViewTrip(trip.id)}
                                                    className="w-full bg-black text-white hover:bg-gray-800 transition-all duration-300 py-1 text-xs"
                                                >
                                                    View Details
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </AccordionContent>
                    </AccordionItem>

                    {/* Ride Bookings Section */}
                    <AccordionItem value="ride-bookings">
                        <AccordionTrigger className="text-xl font-bold text-black bg-gray-100 px-3 py-2">
                            <span className="flex items-center">
                                <Car className="h-5 w-5 mr-2" />
                                Ride Bookings ({rideBookings.length})
                            </span>
                        </AccordionTrigger>
                        <AccordionContent className="p-3 bg-white">
                            {rideBookings.length === 0 ? (
                                <p className="text-gray-600 text-sm">No ride bookings found.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {rideBookings.map((ride) => (
                                        <Card key={ride.id} className="border-1 border-black">
                                            <CardHeader className="bg-gray-50 p-2">
                                                <CardTitle className="text-base font-bold text-black flex items-center">
                                                    <Car className="h-4 w-4 mr-1" />
                                                    {ride.departure} to {ride.destination}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-2 space-y-1">
                                                <p className="text-xs text-gray-700 flex items-center">
                                                    <Users className="h-3 w-3 mr-1" />
                                                    <span className="font-medium">Passengers: </span>{' '}
                                                    {ride.numberOfPeople || 'N/A'}
                                                </p>
                                                <p className="text-xs text-gray-700 flex items-center">
                                                    <DollarSign className="h-3 w-3 mr-1" />
                                                    <span className="font-medium">Budget: </span>{' '}
                                                    {formatCurrency(ride.userSelection?.budget)}
                                                </p>
                                                <p className="text-xs text-gray-700 flex items-center">
                                                    <Car className="h-3 w-3 mr-1" />
                                                    <span className="font-medium">Preferred Vehicle: </span>{' '}
                                                    {ride.userSelection?.preferredVehicle || 'N/A'}
                                                </p>
                                                <p className="text-xs text-gray-700 flex items-center">
                                                    <Calendar className="h-3 w-3 mr-1" />
                                                    <span className="font-medium">Requested On: </span>{' '}
                                                    {formatDate(ride.timestamp)}
                                                </p>
                                                <Button
                                                    onClick={() => handleViewRide(ride.id)}
                                                    className="w-full bg-black text-white hover:bg-gray-800 transition-all duration-300 py-1 text-xs"
                                                >
                                                    View Details
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </AccordionContent>
                    </AccordionItem>

                    {/* Hotel Bookings Section */}
                    <AccordionItem value="hotel-bookings">
                        <AccordionTrigger className="text-xl font-bold text-black bg-gray-100 px-3 py-2">
                            <span className="flex items-center">
                                <Hotel className="h-5 w-5 mr-2" />
                                Hotel Bookings ({hotelBookings.length})
                            </span>
                        </AccordionTrigger>
                        <AccordionContent className="p-3 bg-white">
                            {hotelBookings.length === 0 ? (
                                <p className="text-gray-600 text-sm">No hotel bookings found.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {hotelBookings.map((booking) => (
                                        <Card key={booking.id} className="border-1 border-black">
                                            <CardHeader className="bg-gray-50 p-2">
                                                <CardTitle className="text-base font-bold text-black flex items-center">
                                                    <Hotel className="h-4 w-4 mr-1" />
                                                    {booking.hotelName}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-2 space-y-1">
                                                {/*
                          Placeholder for future image addition
                          <div className="relative">
                            {hotelImageLoading[booking.id] && (
                              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                                <Loader2 className="h-6 w-6 text-black animate-spin" />
                              </div>
                            )}
                            <img
                              src={booking.hotelImageURL || 'https://via.placeholder.com/300x100?text=Hotel+Image'}
                              alt={booking.hotelName}
                              className="w-full h-20 object-cover"
                              onLoad={() => setHotelImageLoading(prev => ({ ...prev, [booking.id]: false }))}
                              onError={() => setHotelImageLoading(prev => ({ ...prev, [booking.id]: false }))}
                            />
                          </div>
                        */}
                                                <p className="text-xs text-gray-700 flex items-center">
                                                    <Calendar className="h-3 w-3 mr-1" />
                                                    <span className="font-medium">Check-In: </span> {formatDate(booking.checkIn)}
                                                </p>
                                                <p className="text-xs text-gray-700 flex items-center">
                                                    <Calendar className="h-3 w-3 mr-1" />
                                                    <span className="font-medium">Check-Out: </span>{' '}
                                                    {formatDate(booking.checkOut)}
                                                </p>
                                                <p className="text-xs text-gray-700 flex items-center">
                                                    <Users className="h-3 w-3 mr-1" />
                                                    <span className="font-medium">Guests: </span> {booking.guests || 'N/A'}
                                                </p>
                                                <p className="text-xs text-gray-700 flex items-center">
                                                    <DollarSign className="h-3 w-3 mr-1" />
                                                    <span className="font-medium">Total Price: </span>{' '}
                                                    {formatCurrency(booking.totalPrice)}
                                                </p>
                                                <p className="text-xs text-gray-700 flex items-center">
                                                    <Users className="h-3 w-3 mr-1" />
                                                    <span className="font-medium">Booked By: </span> {booking.name || 'N/A'}
                                                </p>
                                                <Button
                                                    onClick={() => handleViewHotel(booking.hotelId)}
                                                    className="w-full bg-black text-white hover:bg-gray-800 transition-all duration-300 py-1 text-xs"
                                                >
                                                    View Details
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
};

export default Dashboard;