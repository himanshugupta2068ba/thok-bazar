import mainCategory from "../category/mainCategory";
import { menLevelTwo } from "../category/level2/menlevelTwo";
import { womenLevelTwo } from "../category/level2/womenlevel2";
import { homelivingLevelTwo } from "../category/level2/homelivinglevel2";
import { electronicsLevelTwo } from "../category/level2/eletronicslevel2";
import { menthirdlevel } from "../category/level3/menthirdlevel";
import { womenthirdlevel } from "../category/level3/womenthirdlevel";
import { homethirdlevel } from "../category/level3/homelivinglevel3";
import { electronicthirdlevel } from "../category/level3/electronicslevel3";
import { colours } from "../Filters/colour";
import { price } from "../Filters/price";
import { discount } from "../Filters/discount";

export type ProductSpecificationField = {
  key: string;
  label: string;
  type: "select" | "text";
  placeholder?: string;
  options?: string[];
  filterable?: boolean;
};

const fashionSizes = ["XS", "S", "M", "L", "XL", "XXL"];
const fashionFabricOptions = [
  "Cotton",
  "Denim",
  "Linen",
  "Polyester",
  "Rayon",
  "Silk",
  "Wool",
  "Blended",
];
const fashionFitOptions = [
  "Regular",
  "Slim",
  "Relaxed",
  "Oversized",
  "Tailored",
];
const fashionOccasionOptions = [
  "Casual",
  "Formal",
  "Party",
  "Festive",
  "Sports",
  "Office",
];
const fashionPatternOptions = [
  "Solid",
  "Printed",
  "Checked",
  "Striped",
  "Embroidered",
];

const electronicsBrandOptions = [
  "Apple",
  "Samsung",
  "OnePlus",
  "Dell",
  "HP",
  "Lenovo",
  "Sony",
  "JBL",
  "Boat",
  "Canon",
  "Xiaomi",
];
const electronicsStorageOptions = [
  "32 GB",
  "64 GB",
  "128 GB",
  "256 GB",
  "512 GB",
  "1 TB",
];
const electronicsRamOptions = ["4 GB", "8 GB", "16 GB", "32 GB"];
const electronicsConnectivityOptions = [
  "Bluetooth",
  "Wi-Fi",
  "5G",
  "Wired",
  "Wireless",
  "USB-C",
];
const electronicsWarrantyOptions = [
  "No Warranty",
  "6 Months",
  "1 Year",
  "2 Years",
  "3 Years",
];

const homeMaterialOptions = [
  "Wood",
  "Engineered Wood",
  "Metal",
  "Cotton",
  "Ceramic",
  "Glass",
  "Plastic",
  "Bamboo",
  "Velvet",
];
const homeRoomTypeOptions = [
  "Bedroom",
  "Living Room",
  "Kitchen",
  "Dining Room",
  "Office",
  "Bathroom",
];
const homeFinishOptions = [
  "Matte",
  "Glossy",
  "Natural",
  "Textured",
  "Polished",
];
const homeCareOptions = [
  "Wipe Clean",
  "Machine Wash",
  "Hand Wash",
  "Dry Clean",
  "Do Not Bleach",
];

const fashionFields: ProductSpecificationField[] = [
  {
    key: "color",
    label: "Color",
    type: "select",
    options: colours.map((color) => color.name),
    filterable: true,
  },
  {
    key: "size",
    label: "Size",
    type: "select",
    options: fashionSizes,
    filterable: true,
  },
  {
    key: "fabric",
    label: "Fabric",
    type: "select",
    options: fashionFabricOptions,
    filterable: true,
  },
  {
    key: "fit",
    label: "Fit",
    type: "select",
    options: fashionFitOptions,
    filterable: true,
  },
  {
    key: "occasion",
    label: "Occasion",
    type: "select",
    options: fashionOccasionOptions,
    filterable: true,
  },
  {
    key: "pattern",
    label: "Pattern",
    type: "select",
    options: fashionPatternOptions,
    filterable: false,
  },
];

const electronicsFields: ProductSpecificationField[] = [
  {
    key: "brand",
    label: "Brand",
    type: "select",
    options: electronicsBrandOptions,
    filterable: true,
  },
  {
    key: "model",
    label: "Model",
    type: "text",
    placeholder: "e.g. Galaxy S24, Inspiron 15",
    filterable: false,
  },
  {
    key: "storage",
    label: "Storage",
    type: "select",
    options: electronicsStorageOptions,
    filterable: true,
  },
  {
    key: "ram",
    label: "RAM",
    type: "select",
    options: electronicsRamOptions,
    filterable: true,
  },
  {
    key: "connectivity",
    label: "Connectivity",
    type: "select",
    options: electronicsConnectivityOptions,
    filterable: true,
  },
  {
    key: "warranty",
    label: "Warranty",
    type: "select",
    options: electronicsWarrantyOptions,
    filterable: true,
  },
  {
    key: "color",
    label: "Color",
    type: "select",
    options: colours.map((color) => color.name),
    filterable: true,
  },
];

const homeLivingFields: ProductSpecificationField[] = [
  {
    key: "color",
    label: "Color",
    type: "select",
    options: colours.map((color) => color.name),
    filterable: true,
  },
  {
    key: "material",
    label: "Material",
    type: "select",
    options: homeMaterialOptions,
    filterable: true,
  },
  {
    key: "roomType",
    label: "Room Type",
    type: "select",
    options: homeRoomTypeOptions,
    filterable: true,
  },
  {
    key: "finish",
    label: "Finish",
    type: "select",
    options: homeFinishOptions,
    filterable: true,
  },
  {
    key: "dimensions",
    label: "Dimensions",
    type: "text",
    placeholder: "e.g. 72 x 30 x 18 in",
    filterable: false,
  },
  {
    key: "careInstructions",
    label: "Care Instructions",
    type: "select",
    options: homeCareOptions,
    filterable: false,
  },
];

export const categoryLevelTwoMap: Record<string, any[]> = {
  men: menLevelTwo,
  women: womenLevelTwo,
  "home-living": homelivingLevelTwo,
  electronics: electronicsLevelTwo,
};

export const categoryLevelThreeMap: Record<string, any[]> = {
  men: menthirdlevel,
  women: womenthirdlevel,
  "home-living": homethirdlevel,
  electronics: electronicthirdlevel,
};

export const productSpecificationConfig: Record<string, ProductSpecificationField[]> = {
  men: fashionFields,
  women: fashionFields,
  "home-living": homeLivingFields,
  electronics: electronicsFields,
};

const mainCategoryLookup = new Map<string, string>();
const levelTwoParentLookup = new Map<string, string>();
const levelThreeParentLookup = new Map<string, string>();

mainCategory.forEach((item) => {
  mainCategoryLookup.set(item.categoryid, item.categoryid);
});

Object.entries(categoryLevelTwoMap).forEach(([mainCategoryId, categories]) => {
  categories.forEach((item) => {
    levelTwoParentLookup.set(item.categoryId, mainCategoryId);
    mainCategoryLookup.set(item.categoryId, mainCategoryId);
  });
});

Object.entries(categoryLevelThreeMap).forEach(([mainCategoryId, categories]) => {
  categories.forEach((item) => {
    levelThreeParentLookup.set(item.categoryId, item.parentCategoryId);
    mainCategoryLookup.set(item.categoryId, mainCategoryId);
  });
});

export const getLevelTwoOptions = (mainCategoryId?: string | null) => {
  if (!mainCategoryId) return [];
  return categoryLevelTwoMap[mainCategoryId] || [];
};

export const getLevelThreeOptions = (
  mainCategoryId?: string | null,
  parentCategoryId?: string | null,
) => {
  if (!mainCategoryId || !parentCategoryId) return [];

  return (categoryLevelThreeMap[mainCategoryId] || []).filter(
    (item) => String(item.parentCategoryId) === String(parentCategoryId),
  );
};

export const getProductSpecificationFields = (mainCategoryId?: string | null) => {
  if (!mainCategoryId) return [];
  return productSpecificationConfig[mainCategoryId] || [];
};

export const getFilterableProductSpecificationFields = (
  mainCategoryId?: string | null,
) =>
  getProductSpecificationFields(mainCategoryId).filter(
    (field) => field.filterable && field.options?.length,
  );

export const resolveMainCategoryId = (categoryId?: string | null) => {
  if (!categoryId) return "";

  if (mainCategoryLookup.has(categoryId)) {
    return mainCategoryLookup.get(categoryId) || "";
  }

  if (categoryId.startsWith("men")) return "men";
  if (categoryId.startsWith("women")) return "women";
  if (categoryId.startsWith("electronics")) return "electronics";
  if (categoryId.startsWith("home")) return "home-living";

  return "";
};

export const resolveCategoryPath = (
  categoryId?: string | null,
  fallbackMainCategory?: string | null,
) => {
  if (!categoryId) {
    return {
      mainCategory: fallbackMainCategory || "",
      subCategory: "",
      subSubCategory: "",
    };
  }

  const directMainCategory = resolveMainCategoryId(categoryId);

  if (levelThreeParentLookup.has(categoryId)) {
    const subCategory = levelThreeParentLookup.get(categoryId) || "";
    return {
      mainCategory: levelTwoParentLookup.get(subCategory) || directMainCategory,
      subCategory,
      subSubCategory: categoryId,
    };
  }

  if (levelTwoParentLookup.has(categoryId)) {
    return {
      mainCategory: levelTwoParentLookup.get(categoryId) || directMainCategory,
      subCategory: categoryId,
      subSubCategory: "",
    };
  }

  return {
    mainCategory: fallbackMainCategory || directMainCategory,
    subCategory: "",
    subSubCategory: "",
  };
};

export const getSpecificationValue = (product: any, key: string) => {
  const specifications = product?.specifications || {};
  return specifications[key] || product?.[key] || "";
};

export const priceFilterOptions = price;
export const discountFilterOptions = discount;
