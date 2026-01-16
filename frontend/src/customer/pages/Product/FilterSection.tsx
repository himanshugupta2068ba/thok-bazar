import {
    Button,
    colors,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Pagination,
  Radio,
  RadioGroup,
} from "@mui/material";
import { teal } from "@mui/material/colors";
import { colours } from "../../../data/Filters/colour";
import { useState } from "react";
import { price } from "../../../data/Filters/price";
import { discount } from "../../../data/Filters/discount";

export const FilterSection = () => {

    const [expendColor, setExpendColor] = useState<boolean>(false);
    const [expendPrice, setExpendPrice] = useState<boolean>(false);
    const [expendDiscount, setExpendDiscount] = useState<boolean>(false);
    const handleExpendColor = () => {
        setExpendColor(!expendColor);
    }
    const handleExpendPrice = () => {
        setExpendPrice(!expendPrice);
    }
    const handleExpendDiscount = () => {
        setExpendDiscount(!expendDiscount);
    }
    
  return (
    <div className="z-50 space-y-5 bg-white">
      <div className="flex items-center justify-between h-10 px-9 lg:border-r">
        <p className="text-lg font-semibold">Filters</p>

        <button className="text-teal-700 font-semibold">Clear All</button>
      </div>
      <Divider />
      <div className="px-9 space-y-6 mt-5">
        <section>
          <FormControl sx={{ zIndex: 0 }}>
            <FormLabel
              sx={{ fontSize: "16px", fontWeight: "bold", color: teal[600] }}
            >
              Color
            </FormLabel>

            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              name="radio-buttons-group"
            >
              {colours.slice(0,expendColor?colours.length:5).map(
                (color: any) => (
                  <FormControlLabel
                    value={color.name}
                    control={<Radio />}
                    label={color.name}
                  />
                )
              )}
            </RadioGroup>
          </FormControl>
          <div>
            <Button onClick={handleExpendColor}>{expendColor?"hide":`+${colours.length-5} more`}</Button>
          </div>
        </section>
 <Divider />
        <section>
          <FormControl sx={{ zIndex: 0 }}>
            <FormLabel
              sx={{ fontSize: "16px", fontWeight: "bold", color: teal[600] }}
            >
              Price
            </FormLabel>

            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              name="radio-buttons-group"
            >
              {price.slice(0,expendPrice?price.length:4).map(
                (item: any) => (
                  <FormControlLabel
                    value={item.value}
                    control={<Radio />}
                    label={item.name}
                  />
                )
              )}
            </RadioGroup>
          </FormControl>
          <div>
            <Button onClick={handleExpendPrice}>{expendPrice?"hide":`+${price.length-4} more`}</Button>
          </div>
        </section>
 <Divider />
 <section>
          <FormControl sx={{ zIndex: 0 }}>
            <FormLabel
              sx={{ fontSize: "16px", fontWeight: "bold", color: teal[600] }}
            >
              Discount
            </FormLabel>

            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              name="radio-buttons-group"
            >
              {discount.slice(0,expendDiscount?discount.length:5).map(
                (item: any) => (
                  <FormControlLabel
                    value={item.value}
                    control={<Radio />}
                    label={item.name}
                  />
                )
              )}
            </RadioGroup>
          </FormControl>
          <div>
            <Button onClick={handleExpendDiscount}>{expendDiscount?"hide":`+${discount.length-5} more`}</Button>
          </div>
        </section>
        
      </div>
    </div>
  );
};
