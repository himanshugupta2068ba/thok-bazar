import { Box } from "@mui/material";
import { menLevelTwo } from "../../data/category/level2/menlevelTwo";
import { homelivingLevelTwo } from "../../data/category/level2/homelivinglevel2";
import { womenLevelTwo } from "../../data/category/level2/womenlevel2";
import { electronicsLevelTwo } from "../../data/category/level2/eletronicslevel2";
import { menthirdlevel } from "../../data/category/level3/menthirdlevel";
import { womenthirdlevel } from "../../data/category/level3/womenthirdlevel";
import { electronicthirdlevel } from "../../data/category/level3/electronicslevel3";
import { homethirdlevel } from "../../data/category/level3/homelivinglevel3";
import { useNavigate } from "react-router";

const categoryTwo: { [key: string]: any[] } = {
  men: menLevelTwo,
  women: womenLevelTwo,
  electronics: electronicsLevelTwo,
  "home-living": homelivingLevelTwo,
};
const categoryThree: { [key: string]: any[] } = {
  men: menthirdlevel,
  women: womenthirdlevel,
  electronics: electronicthirdlevel,
  "home-living": homethirdlevel,
};

export const CategorySheet = ({
  selectedCategory,
  onNavigate,
}: any) => {
  const navigate = useNavigate();

  const childCategory = (category: any, parentCategoryId: any) => {
    return category.filter(
      (child: any) => child.parentCategoryId === parentCategoryId,
    );
  };

  const handleCategoryNavigation = (categoryId: string) => {
    onNavigate?.();
    navigate(`/products/${categoryId}`);
  };

  return (
    <Box className="lg:h-125 bg-white border-b border-gray-200 shadow-md overflow-auto z-[140]">
      <div className="flex text-sm flex-wrap">
        {categoryTwo[selectedCategory]?.map((item: any, index: number) => (
          <div
            key={item.name}
            className={`p-8 lg:w-[20%] ${index % 2 == 0 ? "bg-slate-50" : "bg-white"}`}
          >
            <p
              onClick={() => handleCategoryNavigation(item.categoryId)}
              className="mb-3 cursor-pointer font-semibold text-teal-500 hover:text-teal-700"
            >
              {item.name}
            </p>
            <ul className="space-y-3 text-gray-500">
              {childCategory(
                categoryThree[selectedCategory],
                item.categoryId,
              )?.map((item: any) => (
                <div key={item.name}>
                  <li
                    onClick={() => handleCategoryNavigation(item.categoryId)}
                    className="cursor-pointer hover:text-gray-800"
                  >
                    {item.name}
                  </li>
                </div>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Box>
  );
};
