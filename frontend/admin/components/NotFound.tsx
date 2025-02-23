import React from 'react';

type Props = {
  imagePath: string;
  Title: string;
  ButtonText: string;
  Description: string|null;
  Route: string;
};

function NotFound({ imagePath, Title, ButtonText, Description, Route}: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Image */}
      <img
        src={imagePath}
        alt="Not Found"
        className="w-full h-full max-w-xs md:max-w-md lg:max-w-lg my-8"
      />

      {/* Title */}
      <h3 className="text-2xl md:text-4xl font-bold font-mono text-gray-800 text-center mb-4">
        {Title}
      </h3>

      {/* Optional Description */}
      <p className="text-gray-600 text-center max-w-xl mb-8">
      {Description}
      </p>

      {/* Optional Button */}
      <button
        onClick={() => window.location.href = Route} // Replace with your own routing logic
        className=" bg-gray-600 hover:bg-yellow-600 text-white text-base md:text-lg py-2 md:py-3 px-6 md:px-10 lg:px-20 rounded-full shadow-md transition duration-300"
      >
        {ButtonText}
      </button>
    </div>
  );
}

export default NotFound;
