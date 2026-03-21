import { HomeCategoryTable } from "./HomeCategoryTable"

export const GridTable=()=> {
  return (
   <HomeCategoryTable
    section="GRID"
    title="Home Grid Section"
    description="Grid has fixed 6 slots. Edit only the specific grid number you want to update."
    allowCreate={false}
    maxItems={6}
    rowLabel="Grid No"
   /> 
  )
}
