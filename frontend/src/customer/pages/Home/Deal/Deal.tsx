import { useEffect } from "react";
import { DealCard } from "./DealCard.tsx";
import { fetchDeals } from "../../../../Redux Toolkit/featurs/admin/DealSlice";
import { useAppDispatch, useAppSelector } from "../../../../Redux Toolkit/store";

const Deal = () => {
  const dispatch = useAppDispatch();
  const deals = useAppSelector((state) => state.deals.deals || []);

  useEffect(() => {
    dispatch(fetchDeals({ activeOnly: true }));
  }, [dispatch]);

  return (
    <div className="overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex snap-x snap-mandatory gap-4">
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
      </div>
    </div>
  );
};

export default Deal;
