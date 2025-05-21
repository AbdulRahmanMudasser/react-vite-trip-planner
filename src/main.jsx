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
    path: '/book-hotel/:tripId', // New route for hotel booking
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
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
      <Toaster />
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </StrictMode>
);