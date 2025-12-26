import { useRef } from "react";
import Slider from "react-slick";
import { DealCard } from "./DealCard.tsx";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Deal = () => {
  const sliderRef = useRef<Slider | null>(null);

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000
  };

  return (
    <div className="slide-container gap-5">
      <Slider ref={sliderRef} {...settings}>
        {Array.from({ length: 7 }).map((_, i) => (
          <DealCard
            key={i}
            deal={{
              image:
                "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&auto=format&fit=crop&q=60",
              discount: "10"
            }}
          />
        ))}
      </Slider>
    </div>
  );
};

export default Deal;
