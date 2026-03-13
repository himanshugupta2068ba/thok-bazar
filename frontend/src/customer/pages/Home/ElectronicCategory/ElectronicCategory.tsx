import ElectronicCategoryCard from "./ElectronicCard";
import { useAppSelector } from "../../../../Redux Toolkit/store";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ElectronicCategory = () => {
    const electronics = useAppSelector((state) =>
        state.homeCategory.homeCategories.filter(
            (item: any) => item.section === "ELECTRIC_CATEGORIES",
        ),
    );

    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 7,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1800,
        arrows: false,
        responsive: [
            { breakpoint: 1280, settings: { slidesToShow: 6 } },
            { breakpoint: 1024, settings: { slidesToShow: 5 } },
            { breakpoint: 768, settings: { slidesToShow: 4 } },
            { breakpoint: 640, settings: { slidesToShow: 3 } },
        ],
    };

    return(
    <div className="py-5 lg:px-20 border-b z-0 relative">
        <Slider {...settings}>
            {electronics.map((item: any) => (
                <ElectronicCategoryCard key={item._id || item.categoryId} ListItem={item}/>
            ))}
        </Slider>
       </div>
    )
}

export default ElectronicCategory;