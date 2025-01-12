import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const NewArrivals: React.FC = () => {
  const [book, setBook] = useState([
    {
      title: "Project Hail Mary",
      author: "Andy Weir",
      genre: "Science Fiction",
      publishedYear: 2021,
      isbn: "978-0593135204",
      image:
        "https://typebooks.ca/cdn/shop/files/BNCImageAPI_0cff8466-7169-407c-8da5-7e76b2778061_1200x1200.jpg?v=1713893626",
    },
    {
      title: "The Midnight Library",
      author: "Matt Haig",
      genre: "Fiction",
      publishedYear: 2020,
      isbn: "978-0525559474",
      image:
        "https://shereads.com/wp-content/uploads/2019/08/sun-and-her-flowers.jpeg",
    },
    {
      title: "Klara and the Sun - A Tale of Artificial Intelligence and Humanity",
      author: "Kazuo Ishiguro",
      genre: "Science Fiction",
      publishedYear: 2021,
      isbn: "978-0593318170",
      image:
        "https://images.squarespace-cdn.com/content/v1/51f1ba5de4b03517a1a03d38/1521308839465-LSH9U7F8W61W5E559NXU/51ZnpIZcanL._SX376_BO1%2C204%2C203%2C200_.jpg",
    },
    {
      title: "The Invisible Life of Addie LaRue",
      author: "V.E. Schwab",
      genre: "Fantasy",
      publishedYear: 2020,
      isbn: "978-0765387561",
      image:
        "https://static.wixstatic.com/media/09e34c_b2a89a5b03a1489b92770366b211e130~mv2_d_1488_2280_s_2.jpg/v1/fill/w_480,h_735,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/09e34c_b2a89a5b03a1489b92770366b211e130~mv2_d_1488_2280_s_2.jpg",
    },
    {
      title: "The Vanishing Half",
      author: "Brit Bennett",
      genre: "Historical Fiction",
      publishedYear: 2020,
      isbn: "978-0525536291",
      image:
        "https://m.media-amazon.com/images/I/61VTF054rXL._UF1000,1000_QL80_.jpg",
    },
  ]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="flex justify-center items-center bg-amber-100 p-10">
      <div className="max-w-[1200px] w-full mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          New Arrivals
        </h1>
        <Slider {...settings}>
          {book.map((book, index) => (
            <div
              key={index}
              className="p-4 transition-transform transform hover:scale-105"
            >
              <div className="bg-gray-50 rounded-lg shadow-lg overflow-hidden">
                <img
                  src={book.image}
                  alt={book.title}
                  className="object-contain w-full h-64"
                />
                <div className="p-4">
                  <div className="relative w-full overflow-hidden whitespace-nowrap">
                    <p
                      className={`${
                        book.title.length > 20
                          ? "marquee"
                          : "text-lg font-semibold"
                      } text-gray-800 mb-2`}
                    >
                      {book.title}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600">{book.author}</p>
                  <p className="text-sm text-gray-500">{book.genre}</p>
                  <p className="text-sm text-gray-500">ISBN: {book.isbn}</p>
                </div>
                <div className="p-3 flex justify-center items-center">
                  <button className="w-full text-sm md:text-xl bg-slate-600 text-white md:py-4 rounded-md border-2 border-gray-600 hover:bg-[#c1a36f] hover:text-black transition duration-300">
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default NewArrivals;