import React from 'react';
import { FaRoute, FaCalendarAlt, FaRobot } from 'react-icons/fa';

const AboutUs = () => {
  return (
    <section className="w-full bg-white py-12 px-4 md:px-20">
      <div className="flex flex-col md:flex-row items-center gap-10">
        {/* Left Content */}
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-4">About Us</h2>
          <p className="text-gray-600 mb-6">
            Welcome to <strong>AI Trip Planner</strong>, your smart travel companion. We leverage the power of AI to help you design personalized travel itineraries, tailored to your interests, schedule, and budget — all within seconds.
          </p>

          <h3 className="text-xl font-semibold mb-3">What We Offer</h3>
          <ul className="space-y-4 text-gray-700">
            <li className="flex items-start gap-3">
              <FaRoute className="text-[#f56551] mt-1" />
              <span>
                <strong>Smart Itinerary Builder:</strong> Get personalized travel plans in seconds based on your preferences and goals.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <FaCalendarAlt className="text-[#f56551] mt-1" />
              <span>
                <strong>Flexible Scheduling:</strong> Plan your trip for any dates, durations, or locations — no hassle, no limits.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <FaRobot className="text-[#f56551] mt-1" />
              <span>
                <strong>AI Recommendations:</strong> Discover activities, stays, and destinations uniquely matched to your travel style.
              </span>
            </li>
          </ul>
        </div>

        {/* Right Image */}
        <div className="flex-1">
          <img
            src="/about.jpg" // Replace with your actual image path
            alt="AI Trip Planner"
            className="rounded-lg shadow-md"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutUs;