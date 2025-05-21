import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import CreateTrip from './create-trip/index.jsx';
import Viewtrip from './view-trip/[tripid]/index.jsx';
import { Toaster } from '@/components/ui/sonner';
import { GoogleOAuthProvider } from '@react-oauth/google';
import MyTrips from './my-trips';
import HotelBookingPage from './book-hotel/index.jsx';
import SuccessPage from './success';
import CancelPage from './cancel';
import RideBookingPage from './view-trip/[tripid]/components/RideBookingPage.jsx';
import RideSuccessPage from './ride-success';
import RideCancelPage from './ride-cancel';
import Dashboard from './dashboard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/create-trip',
    element: <CreateTrip />,
  },
  {
    path: '/view-trip/:tripId',
    element: <Viewtrip />,
  },
  {
    path: '/my-trips',
    element: <MyTrips />,
  },
  {
    path: '/book-hotel/:tripId',
    element: <HotelBookingPage />,
  },
  {
    path: '/success',
    element: <SuccessPage />,
  },
  {
    path: '/cancel',
    element: <CancelPage />,
  },
  {
    path: '/ride-booking/:rideOptionId',
    element: <RideBookingPage />,
  },
  {
    path: '/ride-success',
    element: <RideSuccessPage />,
  },
  {
    path: '/ride-cancel',
    element: <RideCancelPage />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
      <Toaster />
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </StrictMode>
);