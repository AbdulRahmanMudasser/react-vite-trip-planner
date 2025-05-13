import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#1e293b',
        color: 'white',
        padding: '40px 20px',
      }}
    >
      <div
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8"
      >
        {/* Branding and Newsletter */}
        <div>
          <h3
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '15px',
              color: '#3b82f6',
            }}
          >
            AI Trip Planner
          </h3>
          <p
            style={{
              fontSize: '0.9rem',
              marginBottom: '20px',
              color: '#d1d5db',
            }}
          >
            Plan your dream trip with ease. Get personalized itineraries, expert recommendations, and 24/7 support at your fingertips.
          </p>
          <div className="flex items-center gap-2">
            <input
              type="email"
              placeholder="Enter your email address"
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #4b5563',
                backgroundColor: '#374151',
                color: 'white',
                width: '100%',
                maxWidth: '200px',
              }}
            />
            <button
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '5px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* Services */}
        <div>
          <h4
            style={{
              fontSize: '1.2rem',
              fontWeight: 'bold',
              marginBottom: '15px',
            }}
          >
            Services
          </h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '10px' }}>
              <a href="#" style={{ color: '#d1d5db', textDecoration: 'none' }}>
                Custom Itineraries
              </a>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <a href="#" style={{ color: '#d1d5db', textDecoration: 'none' }}>
                Travel Support
              </a>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <a href="#" style={{ color: '#d1d5db', textDecoration: 'none' }}>
                Local Guides
              </a>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <a href="#" style={{ color: '#d1d5db', textDecoration: 'none' }}>
                AI Recommendations
              </a>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4
            style={{
              fontSize: '1.2rem',
              fontWeight: 'bold',
              marginBottom: '15px',
            }}
          >
            Legal
          </h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '10px' }}>
              <a href="#" style={{ color: '#d1d5db', textDecoration: 'none' }}>
                General Info
              </a>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <a href="#" style={{ color: '#d1d5db', textDecoration: 'none' }}>
                Privacy Policy
              </a>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <a href="#" style={{ color: '#d1d5db', textDecoration: 'none' }}>
                Terms of Service
              </a>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <a href="#" style={{ color: '#d1d5db', textDecoration: 'none' }}>
                How It Works
              </a>
            </li>
          </ul>
        </div>

        {/* Talk to Us */}
        <div>
          <h4
            style={{
              fontSize: '1.2rem',
              fontWeight: 'bold',
              marginBottom: '15px',
            }}
          >
            Talk to Us
          </h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '10px', color: '#d1d5db' }}>
              <a href="mailto:support@aitripplanner.com" style={{ color: '#d1d5db', textDecoration: 'none' }}>
                support@aitripplanner.pk
              </a>
            </li>
            <li style={{ marginBottom: '10px', color: '#d1d5db' }}>+92 311 6874079</li>
            <li style={{ marginBottom: '10px', color: '#d1d5db' }}>+92 331 8675100</li>
          </ul>
        </div>
      </div>

      {/* All Rights Reserved and Social Icons */}
      <div
        className="max-w-6xl mx-auto mt-8 pt-6 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center"
      >
        <p style={{ fontSize: '0.9rem', color: '#d1d5db' }}>
          © {new Date().getFullYear()} AI Trip Planner. All Rights Reserved.
        </p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="#" style={{ color: '#d1d5db' }}>
            <FaFacebook size={20} />
          </a>
          <a href="#" style={{ color: '#d1d5db' }}>
            <FaTwitter size={20} />
          </a>
          <a href="#" style={{ color: '#d1d5db' }}>
            <FaInstagram size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;