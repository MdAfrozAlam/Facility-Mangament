"use client";

import { useEffect, useMemo } from "react";

import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import dayjs from "dayjs";

import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  assetCategories,
  assetStatuses,
  assetLocations,
  assetDepartments,
  assetEmployees,
} from "../../../data/assetOptions";

import DialogHeader from "../../common/DialogHeader/DialogHeader";

import styles from "./AddRegisterDialog.module.css";

const addRegisterSchema = z.object({
  assetName: z
    .string()
    .trim()
    .min(1, "Asset Name is required"),

  category: z
    .string()
    .min(1, "Category is required"),

  subCategory: z
    .string()
    .min(1, "Sub Category is required"),

  status: z
    .string()
    .min(1, "Status is required"),

  location: z
    .string()
    .min(1, "Location is required"),

  department: z
    .string()
    .min(1, "Department is required"),

  purchaseDate: z
    .string()
    .min(1, "Purchase Date is required"),

  assignedTo: z
    .string()
    .min(1, "Assigned To is required"),
});

const defaultValues = {
  assetName: "",
  category: "",
  subCategory: "",
  status: "",
  location: "",
  department: "",
  purchaseDate: "",
  assignedTo: "",
};

export default function AddRegisterDialog({
  open,
  onClose,
  onRegister,
}) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addRegisterSchema),
    defaultValues,
    mode: "onSubmit",
  });

  const selectedCategory = watch("category");

  const subCategoryOptions = useMemo(() => {
    if (!selectedCategory) {
      return [];
    }

    return assetCategories[selectedCategory] || [];
  }, [selectedCategory]);

  /*
   * Reset sub category when category changes
   */
  useEffect(() => {
    const currentSubCategory = watch("subCategory");

    if (
      currentSubCategory &&
      !subCategoryOptions.includes(currentSubCategory)
    ) {
      setValue("subCategory", "");
    }
  }, [
    selectedCategory,
    subCategoryOptions,
    setValue,
    watch,
  ]);

  /*
   * Reset form when dialog closes
   */
  useEffect(() => {
    if (!open) {
      reset(defaultValues);
    }
  }, [open, reset]);

  const handleFormSubmit = (data) => {
    onRegister(data);

    reset(defaultValues);
    onClose();
  };

  const handleCancel = () => {
    reset(defaultValues);
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog
        open={open}
        onClose={handleCancel}
        maxWidth="md"
        fullWidth
      >
        <DialogHeader
          title="Add Asset Register"
          onClose={handleCancel}
        />

        <DialogContent>
          <Box
            component="form"
            id="add-register-form"
            className={styles.formGrid}
            onSubmit={handleSubmit(handleFormSubmit)}
          >
            {/* Asset Name */}

            <TextField
              fullWidth
              size="small"
              label="Asset Name"
              {...register("assetName")}
              error={Boolean(errors.assetName)}
              helperText={errors.assetName?.message}
            />

            {/* Category */}

            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  size="small"
                  error={Boolean(errors.category)}
                >
                  <InputLabel>
                    Category
                  </InputLabel>

                  <Select
                    {...field}
                    label="Category"
                  >
                    <MenuItem value="">
                      Select Category
                    </MenuItem>

                    {Object.keys(assetCategories).map(
                      (category) => (
                        <MenuItem
                          key={category}
                          value={category}
                        >
                          {category}
                        </MenuItem>
                      )
                    )}
                  </Select>

                  <FormHelperText>
                    {errors.category?.message}
                  </FormHelperText>
                </FormControl>
              )}
            />

            {/* Sub Category */}

            <Controller
              name="subCategory"
              control={control}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  size="small"
                  disabled={!selectedCategory}
                  error={Boolean(errors.subCategory)}
                >
                  <InputLabel>
                    Sub Category
                  </InputLabel>

                  <Select
                    {...field}
                    label="Sub Category"
                  >
                    <MenuItem value="">
                      Select Sub Category
                    </MenuItem>

                    {subCategoryOptions.map(
                      (subCategory) => (
                        <MenuItem
                          key={subCategory}
                          value={subCategory}
                        >
                          {subCategory}
                        </MenuItem>
                      )
                    )}
                  </Select>

                  <FormHelperText>
                    {errors.subCategory?.message}
                  </FormHelperText>
                </FormControl>
              )}
            />

            {/* Status */}

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  size="small"
                  error={Boolean(errors.status)}
                >
                  <InputLabel>
                    Status
                  </InputLabel>

                  <Select
                    {...field}
                    label="Status"
                  >
                    <MenuItem value="">
                      Select Status
                    </MenuItem>

                    {assetStatuses.map(
                      (status) => (
                        <MenuItem
                          key={status}
                          value={status}
                        >
                          {status}
                        </MenuItem>
                      )
                    )}
                  </Select>

                  <FormHelperText>
                    {errors.status?.message}
                  </FormHelperText>
                </FormControl>
              )}
            />

            {/* Location */}

            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  size="small"
                  error={Boolean(errors.location)}
                >
                  <InputLabel>
                    Location
                  </InputLabel>

                  <Select
                    {...field}
                    label="Location"
                  >
                    <MenuItem value="">
                      Select Location
                    </MenuItem>

                    {assetLocations.map(
                      (location) => (
                        <MenuItem
                          key={location}
                          value={location}
                        >
                          {location}
                        </MenuItem>
                      )
                    )}
                  </Select>

                  <FormHelperText>
                    {errors.location?.message}
                  </FormHelperText>
                </FormControl>
              )}
            />

            {/* Department */}

            <Controller
              name="department"
              control={control}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  size="small"
                  error={Boolean(errors.department)}
                >
                  <InputLabel>
                    Department
                  </InputLabel>

                  <Select
                    {...field}
                    label="Department"
                  >
                    <MenuItem value="">
                      Select Department
                    </MenuItem>

                    {assetDepartments.map(
                      (department) => (
                        <MenuItem
                          key={department}
                          value={department}
                        >
                          {department}
                        </MenuItem>
                      )
                    )}
                  </Select>

                  <FormHelperText>
                    {errors.department?.message}
                  </FormHelperText>
                </FormControl>
              )}
            />

            {/* Purchase Date */}

            <Controller
              name="purchaseDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Purchase Date"
                  value={
                    field.value
                      ? dayjs(field.value)
                      : null
                  }
                  maxDate={dayjs()}
                  onChange={(date) => {
                    field.onChange(
                      date
                        ? date.format("YYYY-MM-DD")
                        : ""
                    );
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      error: Boolean(
                        errors.purchaseDate
                      ),
                      helperText:
                        errors.purchaseDate?.message,
                    },
                  }}
                />
              )}
            />

            {/* Assigned To */}

            <Controller
              name="assignedTo"
              control={control}
              render={({ field }) => {
                const selectedEmployee =
                  assetEmployees.find(
                    (employee) =>
                      employee.name === field.value
                  ) || null;

                return (
                  <Autocomplete
                    options={assetEmployees}
                    value={selectedEmployee}
                    getOptionLabel={(option) =>
                      option.name
                    }
                    isOptionEqualToValue={(
                      option,
                      value
                    ) =>
                      option.id === value.id
                    }
                    onChange={(_, employee) => {
                      field.onChange(
                        employee?.name || ""
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Assigned To"
                        size="small"
                        error={Boolean(
                          errors.assignedTo
                        )}
                        helperText={
                          errors.assignedTo?.message
                        }
                      />
                    )}
                  />
                );
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions className={styles.actions}>
          <Button onClick={handleCancel}>
            Cancel
          </Button>

          <Button
            type="submit"
            form="add-register-form"
            variant="contained"
          >
            Register Asset
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}