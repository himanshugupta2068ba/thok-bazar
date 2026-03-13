import {
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { teal } from "@mui/material/colors";
import { useMemo, useState } from "react";
import {
  discountFilterOptions,
  getFilterableProductSpecificationFields,
  priceFilterOptions,
} from "../../../data/product/productConfig";

type FilterSectionProps = {
  mainCategoryId?: string;
  filters: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
  onClear: () => void;
};

type FilterRadioSectionProps = {
  sectionKey: string;
  label: string;
  value: string;
  options: { label: string; value: string }[];
  expanded: boolean;
  defaultVisibleCount: number;
  onToggleExpanded: (sectionKey: string) => void;
  onChange: (value: string) => void;
};

const FilterRadioSection = ({
  sectionKey,
  label,
  value,
  options,
  expanded,
  defaultVisibleCount,
  onToggleExpanded,
  onChange,
}: FilterRadioSectionProps) => {
  const visibleOptions = options.slice(
    0,
    expanded ? options.length : defaultVisibleCount,
  );

  return (
    <section>
      <FormControl sx={{ zIndex: 0 }}>
        <FormLabel
          sx={{ fontSize: "16px", fontWeight: "bold", color: teal[600] }}
        >
          {label}
        </FormLabel>

        <RadioGroup value={value || ""} onChange={(event) => onChange(event.target.value)}>
          {visibleOptions.map((option) => (
            <FormControlLabel
              key={`${sectionKey}-${option.value}`}
              value={option.value}
              control={<Radio />}
              label={option.label}
            />
          ))}
        </RadioGroup>
      </FormControl>

      {options.length > defaultVisibleCount ? (
        <div>
          <Button onClick={() => onToggleExpanded(sectionKey)}>
            {expanded ? "hide" : `+${options.length - defaultVisibleCount} more`}
          </Button>
        </div>
      ) : null}
    </section>
  );
};

export const FilterSection = ({
  mainCategoryId,
  filters,
  onFilterChange,
  onClear,
}: FilterSectionProps) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    {},
  );

  const dynamicFilterSections = useMemo(() => {
    return getFilterableProductSpecificationFields(mainCategoryId).map((field) => ({
      key: field.key,
      label: field.label,
      options: (field.options || []).map((option) => ({
        label: option,
        value: option,
      })),
    }));
  }, [mainCategoryId]);

  const sections = [
    {
      key: "priceRange",
      label: "Price",
      defaultVisibleCount: 4,
      options: priceFilterOptions.map((item) => ({
        label: item.name,
        value: item.value,
      })),
    },
    {
      key: "minDiscount",
      label: "Discount",
      defaultVisibleCount: 5,
      options: discountFilterOptions.map((item) => ({
        label: item.name,
        value: item.value,
      })),
    },
    ...dynamicFilterSections.map((section) => ({
      ...section,
      defaultVisibleCount: 5,
    })),
  ];

  const handleToggleExpanded = (sectionKey: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  return (
    <div className="z-50 space-y-5 bg-white">
      <div className="flex items-center justify-between px-9 py-4 lg:border-r">
        <div>
          <p className="text-lg font-semibold">Filters</p>
          <p className="text-xs text-gray-500">
            Showing filters relevant to this category
          </p>
        </div>

        <button className="font-semibold text-teal-700" onClick={onClear}>
          Clear All
        </button>
      </div>
      <Divider />
      <div className="mt-5 space-y-6 px-9">
        {sections.map((section, index) => (
          <div key={section.key}>
            <FilterRadioSection
              sectionKey={section.key}
              label={section.label}
              value={filters[section.key] || ""}
              options={section.options}
              expanded={Boolean(expandedSections[section.key])}
              defaultVisibleCount={section.defaultVisibleCount}
              onToggleExpanded={handleToggleExpanded}
              onChange={(value) => onFilterChange(section.key, value)}
            />
            {index !== sections.length - 1 ? <Divider /> : null}
          </div>
        ))}
      </div>
    </div>
  );
};
