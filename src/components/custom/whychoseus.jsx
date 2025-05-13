import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Link } from "react-router-dom";

const TripPlannerSection = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      style={{
        padding: '40px',
        textAlign: 'center',
      }}
    >
      <h1
        style={{
          fontSize: '2.5rem',
          marginBottom: '40px',
        }}
      >
        Why Choose Our Trip Planner?
      </h1>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
          flexDirection: isMobile ? 'column' : 'row',
          textAlign: isMobile ? 'center' : 'inherit',
        }}
      >
        {/* Left Section */}
        <div
          style={{
            flex: 1,
            position: 'relative',
            marginBottom: isMobile ? '80px' : '0',
          }}
        >
          <img
            src="/trip_planner.avif" // Reference the image directly from public folder
            alt="Traveler"
            style={{
              width: '100%',
              maxWidth: '530px',
              border: '5px solid #e0e7ff',
              marginLeft: '30px',
            }}
          />
          
          
        </div>

        {/* Right Section */}
        <div
          style={{
            flex: 1,
            textAlign: isMobile ? 'center' : 'left',
          }}
        >
          <h2
            style={{
              fontSize: '1.8rem',
              marginBottom: '10px',
            }}
          >
            WHY CHOOSE OUR TRIP PLANNER
          </h2>
          <p
            style={{
              fontSize: '1rem',
              color: '#6b7280',
              marginBottom: '20px',
            }}
          >
            Discover the reasons to choose our AI Trip Planner for your travel needs. Experience
            personalized itineraries, expert recommendations, and seamless planning, making your
            journey unforgettable and stress-free.
          </p>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              marginBottom: '20px',
            }}
          >
            <li
              style={{
                fontSize: '1.1rem',
                marginBottom: '10px',
                color: '#1f2937',
              }}
            >
              ✔ Personalized Itineraries
            </li>
            <li
              style={{
                fontSize: '1.1rem',
                marginBottom: '10px',
                color: '#1f2937',
              }}
            >
              ✔ 24/7 Travel Support
            </li>
            <li
              style={{
                fontSize: '1.1rem',
                marginBottom: '10px',
                color: '#1f2937',
              }}
            >
              ✔ Expert Local Guides
            </li>
            <li
              style={{
                fontSize: '1.1rem',
                marginBottom: '10px',
                color: '#1f2937',
              }}
            >
              ✔ Easy Booking Process
            </li>
          </ul>
          <Link to="/create-trip">
    <Button style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1rem',
              width: isMobile ? '100%' : 'auto',
            }}>Plan Your Trip</Button>
  </Link>
        
        </div>
      </div>
    </div>
  );
};

export default TripPlannerSection;