import { Radio } from "@mui/material";

export const AddressCard = ({
  value,
  selectedValue,
  handleChange,
  item,
}: any) => {
  return (
    <div className="p-5 border border-gray-300 rounded-md flex">
      <div>
        <Radio
          name="radio-button"
          checked={selectedValue === value}
          onChange={handleChange}
          value={value}
        />
      </div>
      <div className="space-y-3 pt-3">
        <h1>{"Pablo Pandy"}</h1>
        <p>{"street 123,mumbai,3211,India"}</p>
        <p><strong>Mobile</strong> 1213244557</p>
      </div>
    </div>
  );
};
