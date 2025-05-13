import React from 'react';
import { Button } from '../ui/button';
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div className="w-full">
      {/* Full-Width Promotion Banner */}
      <section className="relative w-full h-[600px] md:h-[500px] overflow-hidden">
        <img
          src="/landing-page.jpg"
          alt="Family Getaway"
          className="w-full h-full object-cover"
        />

       <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-yellow-400 p-6 md:p-8 rounded-xl max-w-sm shadow-xl">
  <h2 className="text-xl md:text-2xl font-bold mb-2">
    AI Trip Planner Special: Save Time & Plan Smart!
  </h2>
  <p className="text-sm text-gray-800 mb-4">
    Sign in or join to create personalized itineraries with AI.
  </p>
  <Link to="/create-trip">
    <Button>Get Started, It's Free</Button>
  </Link>
</div>
      </section>

      {/* Hero Section */}
      <section className="flex flex-col items-center px-4 md:px-20 xl:px-48 gap-9 py-16">
        <h1 className="font-extrabold text-[32px] md:text-[42px] text-center">
          <span className="text-[#f56551]">Discover Your Next Adventure with AI:</span>
          <p className="text-[24px] md:text-[35px] mt-5">Personalized Itineraries at Your Fingertips.</p>
        </h1>

        <p className="text-lg text-gray-500 text-center max-w-2xl">
          Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.
        </p>

      </section>
    </div>
  );
}

export default Hero;
