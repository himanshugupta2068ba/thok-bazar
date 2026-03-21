import { useState } from "react"
import { DealTable } from "./DealTable"
import { DealCategoryTable } from "./DealCategoryTable"
import { CreateDeal } from "./CreateDeal"
import { Button } from "@mui/material"

const tabs=["Deals","Categories","CreateDeal"];
export const Deal = () => {

    const [activetab, setActiveTab] = useState("Deals")
    return (
        <div>
            <div className="flex gap-4 pb-2">
          {
            tabs.map((tab) => (
              <Button
                variant={tab === activetab ? "contained" : "outlined"}
                onClick={() => setActiveTab(tab)}
                key={tab}
              >
                {tab}
              </Button>
            ))
          }
            </div>
            <div>
              {activetab === "Deals" ? <DealTable/> : activetab === "Categories" ? <DealCategoryTable /> : 
                <div className="mt-3 border-t flex flex-col justify-center items-center h-[70vh]">
                    <CreateDeal />
                </div>}
            </div>
        </div>
    )
}