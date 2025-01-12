import React from "react";
import { Link } from "react-router-dom";
import NewArrivals from "./NewArrivals";

const Home: React.FC = () => {
  return (
    <>
      <div className="sm: pt-28 lg:pt-20 min-h-screen flex items-center justify-center bg-amber-50">
        <div className="pt-20 flex flex-col lg:flex-row items-center justify-around max-w-6xl w-full mx-auto p-6 lg:p-1 space-y-8 lg:space-y-10 lg:space-x-10">
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-600">
              Welcome to
            </h1>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-yellow-600 mt-2">
              Reader’s Paradise
            </h2> 
            <p className="mt-4 text-gray-700 text-base md:text-lg">
              The ultimate book lover's paradise! Join our community and
              contribute to the ever-evolving library of stories, where every
              book has a chance to inspire someone new.
            </p>
            <Link to="/explore">
              <button className="mt-6 bg-gray-600 hover:bg-yellow-600 text-white text-base md:text-lg py-2 md:py-3 px-6 md:px-10 lg:px-20 rounded-full shadow-md transition duration-300">
                Explore
              </button>
            </Link>
          </div>
          {/* Right Section: Illustration */}
          <div className="w-full lg:w-1/3 flex justify-center">
            <img
              src="../images/reader.png" // Replace with your image path
              alt="Reader illustration"
              className="w-80 md:w-96 lg:w-[500px] h-auto"
            />
          </div>
        </div>
      </div>
    <NewArrivals/>
     
    </>
  );
};

export default Home;
