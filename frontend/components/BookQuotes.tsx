import React from "react";
import QuoteSlider from "./QuoteSlider";
function BookQuotes() {
  return (
    <div className="p-24 flex justify-start items-center bg-gray-800 ">
        <div className="container w-full">
      <img src="../images/couple.png" alt="couple.png" className="" />
        </div>
      <QuoteSlider /> 
    </div>
  );
}

export default BookQuotes;
