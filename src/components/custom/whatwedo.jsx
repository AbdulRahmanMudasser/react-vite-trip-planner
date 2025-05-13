import React, { useState, useEffect } from 'react';

const WhatWeOfferSection = () => {
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
        backgroundColor: '#f9fafb',
      }}
    >
      <h1
        style={{
          fontSize: '2.5rem',
          marginBottom: '20px',
          color: '#1f2937',
          borderBottom: '2px solid #3b82f6',
          display: 'inline-block',
          paddingBottom: '10px',
        }}
      >
        What We Offer
      </h1>
      <p
        style={{
          fontSize: '1rem',
          color: '#6b7280',
          marginBottom: '40px',
          maxWidth: '800px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        We bring travel planning to your convenience, offering personalized trip solutions tailored to
        your needs. Our platform connects you with experienced travel experts, provides custom
        itineraries, and offers support whenever you require it.
      </p>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          flexDirection: isMobile ? 'column' : 'row',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Custom Itineraries Card */}
        <div
          style={{
            flex: '1',
            background: 'white',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            minWidth: '200px',
          }}
        >
          <img
            src="/custom.jpg"
            alt="Custom Itineraries"
            style={{
              width: '50px',
              marginBottom: '15px',
            }}
          />
          <h3
            style={{
              fontSize: '1.2rem',
              marginBottom: '10px',
              color: '#1f2937',
            }}
          >
            Custom Itineraries
          </h3>
          <p
            style={{
              fontSize: '0.9rem',
              color: '#6b7280',
              lineHeight: '1.5',
            }}
          >
            Design your perfect trip with our AI-powered itineraries tailored to your preferences,
            ensuring a unique and memorable journey.
          </p>
        </div>

        {/* Travel Support Card */}
        <div
          style={{
            flex: '1',
            background: 'white',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            minWidth: '200px',
          }}
        >
          <img
            src="/custom.jpg"
            alt="Travel Support"
            style={{
              width: '50px',
              marginBottom: '15px',
            }}
          />
          <h3
            style={{
              fontSize: '1.2rem',
              marginBottom: '10px',
              color: '#1f2937',
            }}
          >
            Travel Support
          </h3>
          <p
            style={{
              fontSize: '0.9rem',
              color: '#6b7280',
              lineHeight: '1.5',
            }}
          >
            Get 24/7 assistance from our dedicated team to handle any travel concerns with prompt and
            efficient support.
          </p>
        </div>

        {/* Local Guides Card */}
        <div
          style={{
            flex: '1',
            background: 'white',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            minWidth: '200px',
          }}
        >
          <img
            src="/custom.jpg"
            alt="Local Guides"
            style={{
              width: '50px',
              marginBottom: '15px',
            }}
          />
          <h3
            style={{
              fontSize: '1.2rem',
              marginBottom: '10px',
              color: '#1f2937',
            }}
          >
            Local Guides
          </h3>
          <p
            style={{
              fontSize: '0.9rem',
              color: '#6b7280',
              lineHeight: '1.5',
            }}
          >
            Explore with confidence alongside our expert local guides who enhance your travel
            experience with insider knowledge.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhatWeOfferSection;