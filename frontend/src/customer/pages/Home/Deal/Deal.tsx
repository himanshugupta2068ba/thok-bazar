import { useEffect, useRef } from "react";
import Slider from "react-slick";
import { DealCard } from "./DealCard.tsx";
import { fetchDeals } from "../../../../Redux Toolkit/featurs/admin/DealSlice";
import { useAppDispatch, useAppSelector } from "../../../../Redux Toolkit/store";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Deal = () => {
  const dispatch = useAppDispatch();
  const sliderRef = useRef<Slider | null>(null);
  const deals = useAppSelector((state) => state.deals.deals || []);

  useEffect(() => {
    dispatch(fetchDeals({ activeOnly: true }));
  }, [dispatch]);

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
        {deals.map((item: any) => (
          <DealCard
            key={item._id || item.categoryId}
            deal={{
              id: item._id || item.id,
              image: item.displayImage || item.category?.image || item.image,
              name: item.displayName || item.category?.name || item.name,
              discount: item.discount,
              categoryId: item.category?.categoryId || item.categoryId || "",
            }}
          />
        ))}
      </Slider>
    </div>
  );
};

export default Deal;
