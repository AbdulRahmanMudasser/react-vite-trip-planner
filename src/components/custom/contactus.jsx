import React from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const ContactUs = () => {
  return (
    <section
      style={{
        backgroundColor: '#1e293b',
        color: 'white',
        padding: '40px 20px',
        textAlign: 'center',
      }}
    >
      <h2
        style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: '20px',
          color: '#3b82f6',
        }}
      >
        Contact Us
      </h2>
      <p
        style={{
          fontSize: '0.9rem',
          color: '#d1d5db',
          marginBottom: '40px',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        Have questions about planning your trip with AI Trip Planner? We're here to help! Reach out to
        us for support or inquiries about your travel itineraries.
      </p>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        {/* Contact Information */}
        <div className="flex-1 text-left">
          <div
            style={{
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
            }}
          >
            <FaMapMarkerAlt
              style={{ color: '#3b82f6', fontSize: '1.5rem' }}
            />
            <div>
              <h3
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  marginBottom: '5px',
                }}
              >
                Address
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#d1d5db' }}>
                Rahim Yar Khan, Pakistan
              </p>
            </div>
          </div>

          <div
            style={{
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
            }}
          >
            <FaPhoneAlt
              style={{ color: '#3b82f6', fontSize: '1.5rem' }}
            />
            <div>
              <h3
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  marginBottom: '5px',
                }}
              >
                Phone
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#d1d5db' }}>
                +92 311 6874079
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
            }}
          >
            <FaEnvelope
              style={{ color: '#3b82f6', fontSize: '1.5rem' }}
            />
            <div>
              <h3
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  marginBottom: '5px',
                }}
              >
                Email
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#d1d5db' }}>
                support@aitripplanner.pk
              </p>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
          <h3
            style={{
              fontSize: '1.2rem',
              fontWeight: 'bold',
              marginBottom: '15px',
              color: '#1e293b',
            }}
          >
            Send Message
          </h3>
          <form
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
            }}
          >
            <input
              type="text"
              placeholder="Full Name"
              style={{
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '5px',
                fontSize: '0.9rem',
              }}
            />
            <input
              type="email"
              placeholder="Email"
              style={{
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '5px',
                fontSize: '0.9rem',
              }}
            />
            <textarea
              placeholder="Type your Message..."
              style={{
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '5px',
                fontSize: '0.9rem',
                minHeight: '100px',
                resize: 'vertical',
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '10px',
                border: 'none',
                borderRadius: '5px',
                fontSize: '1rem',
                cursor: 'pointer',
              }}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;