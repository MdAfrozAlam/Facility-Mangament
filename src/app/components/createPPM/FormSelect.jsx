"use client";

import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

import { Controller } from "react-hook-form";

export default function FormSelect({
  name,
  control,
  label,
  options = [],
  required = false,
  disabled = false,
  error,
  placeholder = `Select ${label}`,
  onChange,
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControl
          fullWidth
          size="small"
          required={required}
          disabled={disabled}
          error={Boolean(error)}
        >
          <InputLabel>{label}</InputLabel>

          <Select
            {...field}
            label={label}
            value={field.value ?? ""}
            onChange={(event) => {
              const value =
                event.target.value;

              field.onChange(value);

              onChange?.(value);
            }}
          >
            <MenuItem value="">
              {placeholder}
            </MenuItem>

            {options.map((option) => {
              const value =
                typeof option === "string"
                  ? option
                  : option.value;

              const label =
                typeof option === "string"
                  ? option
                  : option.label;

              return (
                <MenuItem
                  key={value}
                  value={value}
                >
                  {label}
                </MenuItem>
              );
            })}
          </Select>

          {error && (
            <FormHelperText>
              {error.message}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}