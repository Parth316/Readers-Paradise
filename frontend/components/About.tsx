import React from "react";
import { Link } from "react-router-dom";

const About: React.FC = () => {
  return (
    <div className="bg-amber-50 pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#D89B30] to-[#FFD58D] py-16 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#3f3d3c] mb-4">
            About Reader’s Paradise
          </h1>
          <p className="text-lg md:text-xl text-[#3f3d3c] max-w-3xl mx-auto">
            Discover a world where stories come to life. At Reader’s Paradise,
            we’re passionate about connecting book lovers with their next great
            read, fostering a community of avid readers, and celebrating the
            magic of literature.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#3f3d3c] mb-6">
                Our Story
              </h2>
              <p className="text-gray-700 mb-4">
                Reader’s Paradise was born out of a deep love for books and a
                desire to create a sanctuary for readers everywhere. Founded in
                2025 by a group of lifelong friends who shared a passion for
                literature, our journey began with a small bookstore in
                Literature City. We dreamed of a place where readers could find
                not just books, but a community—a space to share stories, ideas,
                and inspiration.
              </p>
              <p className="text-gray-700 mb-4">
                Over the years, we’ve grown from that humble bookstore into an
                online platform that serves book lovers worldwide. Our mission
                remains the same: to make reading accessible, enjoyable, and
                enriching for everyone. Whether you’re a fan of classic
                literature, modern fiction, or niche genres, Reader’s Paradise is
                here to help you find your next favorite book.
              </p>
              <p className="text-gray-700">
                Today, we’re proud to offer a vast collection of books, a
                seamless online shopping experience, and a vibrant community of
                readers who connect through book clubs, discussions, and events.
                Our journey is far from over, and we’re excited to continue
                growing with our readers every step of the way.
              </p>
            </div>
            <div className="relative">
              <img
                src="../images/bookstore.jpg"
                alt="Bookstore interior"
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#3f3d3c] mb-6">
                Our Mission
              </h2>
              <p className="text-gray-700 mb-4">
                At Reader’s Paradise, our mission is to ignite a lifelong love
                for reading in every individual. We believe that books have the
                power to inspire, educate, and transform lives. By curating a
                diverse selection of books and providing a platform for readers
                to connect, we aim to make literature accessible to all.
              </p>
              <p className="text-gray-700">
                We’re committed to supporting authors, promoting literacy, and
                creating a space where readers can explore new worlds, ideas, and
                perspectives. Whether you’re a seasoned bookworm or just starting
                your reading journey, we’re here to guide you every step of the
                way.
              </p>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#3f3d3c] mb-6">
                Our Vision
              </h2>
              <p className="text-gray-700 mb-4">
                Our vision is to build a global community of readers who are
                united by their love for books. We envision a world where every
                person has access to the stories that resonate with them, where
                reading is celebrated as a source of joy, knowledge, and
                connection.
              </p>
              <p className="text-gray-700">
                We strive to be the go-to destination for book lovers,
                continually innovating to enhance the reading experience—whether
                through personalized recommendations, exclusive events, or
                partnerships with authors and publishers. Together, we can create
                a brighter, more connected world through the power of stories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-16 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#3f3d3c] text-center mb-12">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="text-center">
              <img
                src="../images/a1.webp"
                alt="Team Member 1"
                className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
              />
              <h3 className="text-xl font-semibold text-[#3f3d3c]">
                Parth Prajapati
              </h3>
              <p className="text-gray-600">Coding and implementations</p>
              <p className="text-gray-700 mt-2">
                  
              </p>
            </div>
            {/* Team Member 2 */}
            <div className="text-center">
              <img
                src="../images/a2.jpg"
                alt="Team Member 2"
                className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
              />
              <h3 className="text-xl font-semibold text-[#3f3d3c]">
                Ahmed Ketari
              </h3>
              <p className="text-gray-600">Software Security with best practices </p>
           
            </div>
            {/* Team Member 3 */}
            <div className="text-center">
              <img
                src="../images/a3.webp"
                alt="Team Member 3"
                className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
              />
              <h3 className="text-xl font-semibold text-[#3f3d3c]">
                Varinder Kumar
              </h3>
              <p className="text-gray-600">Software testing and UI designing</p>
            </div>
            
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gradient-to-r from-[#D89B30] to-[#FFD58D] py-16 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#3f3d3c] mb-4">
            Join the Reader’s Paradise Community
          </h2>
          <p className="text-lg md:text-xl text-[#3f3d3c] max-w-3xl mx-auto mb-8">
            Whether you’re looking for your next great read or a community to
            share your love of books with, Reader’s Paradise is here for you.
            Sign up today and start exploring a world of stories!
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

export default About;