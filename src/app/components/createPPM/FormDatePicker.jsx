"use client";

import { Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

export default function FormDatePicker({
  name,
  control,
  label,
  required = false,
  error,
  onDateChange,
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <DatePicker
          label={label}
          value={
            field.value
              ? dayjs(field.value)
              : null
          }
          onChange={(date) => {
            const value = date
              ? date.format("YYYY-MM-DD")
              : "";

            field.onChange(value);

            onDateChange?.(value);
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              size: "small",
              required,
              error: Boolean(error),
              helperText: error?.message,
            },
          }}
        />
      )}
    />
  );
}