import React, { useState } from "react";

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    // Handle search logic here
    console.log("Searching for:", searchTerm);
  };

  return (
    <div className="flex items-center justify-center max-h-16">
      <div className="relative w-full max-w-md ">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          className=" w-full py-2 px-4 pr-10 rounded-full border-2 border-gray-300 focus:outline-none focus:border-emerald-500"
          placeholder="Search..."
        />
        <button
          onClick={handleSearch}
          className="absolute top-0 right-0 mt-2 mr-4 align-center"
        >
          <svg
            className="w-5 h-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35m1.75-3.4a7.5 7.5 0 1 0-15 0 7.5 7.5 0 0 0 15 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
