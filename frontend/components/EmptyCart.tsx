import React from "react";

const EmptyCart = () => {
  return (
    <div className="max-w-2xl pt-24 mx-auto my-16 p-8 md:p-12 bg-gray-50 rounded-lg shadow-md">
      {/* Cart Icon */}
     <img src="../images/cart.png" alt="Empty Cart" className="w-1/4 mx-auto" />

      {/* Title */}
      <h2 className="text-3xl font-semibold text-gray-900 text-center mb-4">
        Your Cart is Empty
      </h2>

      {/* Message */}
      <p className="text-gray-600 text-center mb-8 max-w-prose mx-auto">
        Looks like you haven't added any items to your cart yet. Start exploring
        our collection of books and resources to find something great!
      </p>

      {/* CTA Button */}
      <button
            type="submit"
            className="mt-4 max-w-prose w-25 rounded-lg bg-slate-600 p-3 text-white hover:bg-[#c1a36f] hover:text-black transition duration-300"
         >
            Continue
          </button>

      {/* Suggestions Section */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h3 className="text-gray-600 text-lg font-medium text-center mb-6">
          Popular Right Now
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-md mx-auto">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white p-4 rounded-lg shadow-xs hover:shadow-md transition-shadow 
                         duration-200 cursor-pointer text-gray-700 text-center"
            >
              Featured Book {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmptyCart;