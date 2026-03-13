import { FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import type { ProductSpecificationField } from "../../data/product/productConfig";

type ProductSpecificationFieldsProps = {
  fields: ProductSpecificationField[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
};

export const ProductSpecificationFields = ({
  fields,
  values,
  onChange,
}: ProductSpecificationFieldsProps) => {
  if (!fields.length) return null;

  return (
    <>
      {fields.map((field) => (
        <Grid key={field.key} size={{ xs: 12, md: 6 }}>
          {field.type === "select" ? (
            <FormControl fullWidth>
              <InputLabel id={`${field.key}-label`}>{field.label}</InputLabel>
              <Select
                labelId={`${field.key}-label`}
                value={values[field.key] || ""}
                label={field.label}
                onChange={(event) => onChange(field.key, String(event.target.value))}
              >
                <MenuItem value="">
                  <em>Select {field.label}</em>
                </MenuItem>
                {(field.options || []).map((option) => (
                  <MenuItem key={`${field.key}-${option}`} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <input
              value={values[field.key] || ""}
              onChange={(event) => onChange(field.key, event.target.value)}
              placeholder={field.placeholder || field.label}
              className="w-full rounded-md border-2 border-gray-300 p-2"
            />
          )}
        </Grid>
      ))}
    </>
  );
};
