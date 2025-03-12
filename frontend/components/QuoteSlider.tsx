import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const quotes = [
  { text: "A room without books is like a body without a soul.", author: "Marcus Tullius Cicero" },
  { text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss" },
  { text: "Reading is to the mind what exercise is to the body.", author: "Joseph Addison" },
  { text: "Books are a uniquely portable magic.", author: "Stephen King" },
  { text: "There is no friend as loyal as a book.", author: "Ernest Hemingway" },
  { text: "A book is a dream that you hold in your hand.", author: "Neil Gaiman" },
  { text: "Reading gives us someplace to go when we have to stay where we are.", author: "Mason Cooley" }
];

const QuoteSlider = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    adaptiveHeight: true,
  };

  return (
    <div className="w-2/3 h-48 bg-gray-800">
      <Slider {...settings}>
        {quotes.map((quote, index) => (
          <div key={index} className="p-10 text-center">
            <h1 className="text-3xl font-semibold text-amber-400 py-3 break-words">{quote.text}</h1>
            <h3 className="text-xl font-bold text-amber-500 py-3">– {quote.author}</h3>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default QuoteSlider;