import React from "react";
import { Link } from "react-router-dom";

const Services: React.FC = () => {
  return (
    <div className="bg-amber-50 pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#D89B30] to-[#FFD58D] py-16 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#3f3d3c] mb-4">
            Our Services
          </h1>
          <p className="text-lg md:text-xl text-[#3f3d3c] max-w-3xl mx-auto">
            At Reader’s Paradise, we offer a range of services designed to make
            your reading experience exceptional. From finding your next great
            read to connecting with fellow book lovers, we’ve got you covered.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service 1: Online Bookstore */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <div className="flex justify-center mb-4">
                <svg
                  className="w-12 h-12 text-[#D89B30]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#3f3d3c] text-center mb-2">
                Online Bookstore
              </h3>
              <p className="text-gray-700 text-center">
                Browse and purchase from our extensive collection of books
                spanning all genres—fiction, non-fiction, classics, and more.
                Enjoy a seamless shopping experience with fast delivery and
                secure payments.
              </p>
            </div>

            {/* Service 2: Personalized Recommendations */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <div className="flex justify-center mb-4">
                <svg
                  className="w-12 h-12 text-[#D89B30]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01m-.01 4h.01"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#3f3d3c] text-center mb-2">
                Personalized Recommendations
              </h3>
              <p className="text-gray-700 text-center">
                Discover books tailored to your tastes. Our smart recommendation
                system analyzes your reading history and preferences to suggest
                titles you’ll love.
              </p>
            </div>

            {/* Service 3: Book Clubs */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <div className="flex justify-center mb-4">
                <svg
                  className="w-12 h-12 text-[#D89B30]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#3f3d3c] text-center mb-2">
                Book Clubs
              </h3>
              <p className="text-gray-700 text-center">
                Join our vibrant book clubs to connect with fellow readers.
                Participate in discussions, share your thoughts, and make new
                friends who share your love for books.
              </p>
            </div>

            {/* Service 4: Author Events */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <div className="flex justify-center mb-4">
                <svg
                  className="w-12 h-12 text-[#D89B30]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11H5m14 0a8 8 0 01-8 8m8-8a8 8 0 00-8-8m8 8h2m-2 0v2m-14-2H3m2 0a8 8 0 018 8m-8-8a8 8 0 008-8m-8 8H3m2 0v2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#3f3d3c] text-center mb-2">
                Author Events & Signings
              </h3>
              <p className="text-gray-700 text-center">
                Attend exclusive events with your favorite authors. From virtual
                book signings to live Q&A sessions, get closer to the creators
                behind the stories you love.
              </p>
            </div>

            {/* Service 5: Fast Delivery */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <div className="flex justify-center mb-4">
                <svg
                  className="w-12 h-12 text-[#D89B30]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#3f3d3c] text-center mb-2">
                Fast & Reliable Delivery
              </h3>
              <p className="text-gray-700 text-center">
                Get your books delivered to your doorstep quickly and safely.
                We partner with trusted shipping services to ensure your order
                arrives on time, every time.
              </p>
            </div>

            {/* Service 6: Customer Support */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <div className="flex justify-center mb-4">
                <svg
                  className="w-12 h-12 text-[#D89B30]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#3f3d3c] text-center mb-2">
                Dedicated Customer Support
              </h3>
              <p className="text-gray-700 text-center">
                Our friendly support team is here to assist you with any
                questions or concerns. Reach out via email, phone, or live chat
                for prompt and helpful service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gradient-to-r from-[#D89B30] to-[#FFD58D] py-16 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#3f3d3c] mb-4">
            Ready to Explore Reader’s Paradise?
          </h2>
          <p className="text-lg md:text-xl text-[#3f3d3c] max-w-3xl mx-auto mb-8">
            Sign up today to start enjoying our services and become part of our
            growing community of book lovers.
          </p>
          <Link
            to="/signup"
            className="inline-block bg-slate-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-[#c1a36f] hover:text-black transition duration-300"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Services;