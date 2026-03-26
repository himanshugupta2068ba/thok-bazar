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
    <section className="relative z-0 px-4 pt-5 sm:px-6 lg:px-20">
        <div className="absolute inset-x-4 top-4 h-24 rounded-[32px] bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.10),_transparent_68%)] sm:inset-x-6 lg:inset-x-20" />
        <div className="relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/90 px-4 py-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur-sm sm:px-6">
            <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-700">Popular Picks</p>
                    <h2 className="mt-1 text-lg font-semibold text-slate-900 sm:text-xl">Electronic Categories</h2>
                </div>
                <div className="hidden h-px flex-1 bg-[linear-gradient(90deg,rgba(15,23,42,0.16),rgba(20,184,166,0.18),transparent)] sm:block" />
            </div>

            <Slider {...settings}>
                {electronics.map((item: any) => (
                    <ElectronicCategoryCard key={item._id || item.categoryId} ListItem={item}/>
                ))}
            </Slider>
        </div>
       </section>
    )
}

export default ElectronicCategory;
