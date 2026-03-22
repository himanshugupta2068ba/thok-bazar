import { useState } from "react"
import { DealTable } from "./DealTable"
import { DealCategoryTable } from "./DealCategoryTable"
import { CreateDeal } from "./CreateDeal"
import { Button } from "@mui/material"

const tabs=["Deals","Categories","CreateDeal"];
export const Deal = () => {

    const [activetab, setActiveTab] = useState("Deals")
    const [selectedDealCategory, setSelectedDealCategory] = useState<any | null>(null);

    const handleOpenCreateDeal = (category: any) => {
      setSelectedDealCategory(category);
      setActiveTab("CreateDeal");
    };

    const handleTabChange = (tab: string) => {
      setActiveTab(tab);

      if (tab !== "CreateDeal") {
        setSelectedDealCategory(null);
      }
    };

    return (
        <div>
            <div className="flex gap-4 pb-2">
          {
            tabs.map((tab) => (
              <Button
                variant={tab === activetab ? "contained" : "outlined"}
                onClick={() => handleTabChange(tab)}
                key={tab}
              >
                {tab}
              </Button>
            ))
          }
            </div>
            <div>
              {activetab === "Deals" ? <DealTable/> : activetab === "Categories" ? <DealCategoryTable onCreateDeal={handleOpenCreateDeal} /> : 
                <div className="mt-3 border-t flex flex-col justify-center items-center h-[70vh]">
                    <CreateDeal preselectedCategory={selectedDealCategory} />
                </div>}
            </div>
        </div>
    )
}
