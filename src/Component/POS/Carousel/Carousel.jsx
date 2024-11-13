/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import Slider from "react-slick";
import './Carousel.css'; // Assuming your styles are here



function Carousel({ filteredCategories, onCategoryClick , filteredProducts }) {
  const [loading, setLoading] = useState(true);
console.log(filteredProducts)
  useEffect(() => {
    if (filteredCategories.length > 0) {
      setLoading(false);
    }
  }, [filteredCategories]);

  const settings = {
    dots: true,
    infinite: filteredCategories.length > 1, // Infinite only if there is more than 1 slide
    speed: 500,
    slidesToShow: Math.min(filteredCategories.length, 3),
    slidesToScroll: 1,
    centerMode: true,
    responsive: [
   
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(filteredCategories.length, 4),
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(filteredCategories.length, 2),
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  if (loading) {
    return <div className=" flex justify-center items-center">
      No Category Found
    </div>;
  }
  console.log(filteredCategories)

  return (
    <div className="md:w-[92%] mt-4 mx-auto">
      <Slider {...settings}>
        {filteredCategories.map((category, index) => (
          <div
            key={index}
            className="px-1 md:py-2 py-1 rounded-md"
            onClick={() => onCategoryClick(category.id)} // Call the callback function
          >
            <div className="flex justify-center items-center gap-2 hover:bg-[#444CB4] hover:text-white py-3 rounded-lg shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
              <img
                className="w-16 h-16 rounded-full bg-sky-400"
                src={category.image}
                alt={category.name}
              />
              <div className="flex flex-col">
                <h1 className="font-semibold">{category.name}</h1>
                <h1>{category.stock}</h1>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default Carousel;
