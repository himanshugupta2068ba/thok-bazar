import { useNavigate } from "react-router";
import { optimizeImageUrl } from "../../../../util/image";

export const DealCard = ({ deal }: any) => {
    const navigate = useNavigate();

    const handleOpenDeal = () => {
        if (!deal?.id) {
            return;
        }

        const searchParams = new URLSearchParams({
            deal: String(deal.id),
        });
        const targetPath = deal?.categoryId
            ? `/products/${deal.categoryId}?${searchParams.toString()}`
            : `/products?${searchParams.toString()}`;

        navigate(targetPath);
    };

    return(
        <div className='group min-w-[220px] snap-start cursor-pointer sm:min-w-[240px] lg:min-w-[255px]' onClick={handleOpenDeal}>
            <img
                className='border-x-[7px] border-t-[7px]  w-full h-48 object-cover object-top transition-transform duration-500 group-hover:scale-[0.98]'
                src={optimizeImageUrl(deal.image, { width: 640, height: 384, fit: "crop" })}
                alt={deal.name}
                loading="lazy"
                decoding="async"
            />
            <div className='border-4 border-black bg-black text-white p-2 text-center transition-colors duration-300 group-hover:bg-teal-600 group-hover:border-teal-600'>
               <p className='text-lg font-bold'>{deal.name}</p>
               {deal.discount ? <p className='text-sm font-semibold'>{deal.discount}% OFF</p> : null}
               <p className='font-bold'>shop now</p>
            </div>
        </div>
    )
}

