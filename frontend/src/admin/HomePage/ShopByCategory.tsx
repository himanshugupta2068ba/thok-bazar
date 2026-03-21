import { HomeCategoryTable } from "./HomeCategoryTable"

export const ShopByCategory = () => {
    return (
        <div>
            <HomeCategoryTable
                section="SHOP_BY_CATEGORY"
                title="Shop By Category Section"
                description="Manage top-level categories shown in the shop-by-category section."
                addButtonLabel="Add Shop Category"
            />
        </div>
    )
}