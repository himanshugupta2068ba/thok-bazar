import { Button, Radio } from "@mui/material";

export const AddressCard = ({
  value,
  selectedValue,
  handleChange,
  item,
  onDelete,
}: any) => {
  const addressTitle = item?.name || "Address";
  const addressLine = [item?.address, item?.locality, item?.city, item?.state, item?.pincode]
    .filter(Boolean)
    .join(", ");
  const mobile = item?.mobile || "-";

  return (
    <div className="p-5 border border-gray-300 rounded-md flex">
      <div>
        <Radio
          name="radio-button"
          checked={String(selectedValue) === String(value)}
          onChange={handleChange}
          value={value}
        />
      </div>
      <div className="space-y-3 pt-3 w-full">
        <h1>{addressTitle}</h1>
        <p>{addressLine || "Address details not available"}</p>
        <p><strong>Mobile</strong> {mobile}</p>
        {onDelete ? (
          <div>
            <Button size="small" color="error" onClick={() => onDelete(value)}>
              Delete
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
