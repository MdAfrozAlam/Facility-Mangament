"use client";

import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
} from "@mui/material";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { organizationSchema } from "../../../schemas/organizationSchema";
import { getCurrentPosition } from "../../../utils/location/getCurrentPosition";

import DialogHeader from "../../common/DialogHeader/DialogHeader";

import styles from "./OrganizationDialog.module.css";

const defaultValues = {
  name: "",
  contactPerson: "",
  email: "",
  phone: "",
  telephone: "",
  street: "",
  city: "",
};

const toFormValues = (organization) => ({
  name: organization.name ?? "",
  contactPerson: organization.contactPerson ?? "",
  email: organization.email ?? "",
  phone: organization.phone ?? "",
  telephone: organization.telephone ?? "",
  street: organization.street ?? "",
  city: organization.city ?? "",
});

const hasCoordinates = (organization) =>
  organization != null &&
  organization.latitude !== "" &&
  organization.longitude !== "" &&
  Number.isFinite(Number(organization.latitude)) &&
  Number.isFinite(Number(organization.longitude));

/*
 * Add / Edit organization dialog.
 * Pass `organization` to edit an existing one, leave it empty to add.
 */
export default function OrganizationDialog({
  open,
  organization = null,
  onClose,
  onSubmit,
}) {
  const isEdit = Boolean(organization);

  const [locationError, setLocationError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(organizationSchema),
    defaultValues,
    mode: "onSubmit",
  });

  /*
   * Fill the form when the dialog opens, clear it when it closes
   */
  useEffect(() => {
    reset(
      open && organization
        ? toFormValues(organization)
        : defaultValues
    );
  }, [open, organization, reset]);

  /*
   * Address fields are sent nested under `address`.
   * Latitude / longitude are not entered by the user: they are read from the
   * browser's location. An edit keeps the coordinates already saved.
   */
  const handleFormSubmit = async (data) => {
    const { street, city, ...rest } = data;

    setLocationError("");

    let coordinates;

    if (hasCoordinates(organization)) {
      coordinates = {
        latitude: Number(organization.latitude),
        longitude: Number(organization.longitude),
      };
    } else {
      try {
        coordinates = await getCurrentPosition();
      } catch (error) {
        setLocationError(error.message);

        return;
      }
    }

    await onSubmit({
      ...rest,
      address: {
        street,
        city,
        ...coordinates,
      },
    });
  };

  const handleCancel = () => {
    if (isSubmitting) return;

    setLocationError("");
    onClose();
  };

  const fieldProps = (name) => ({
    fullWidth: true,
    size: "small",
    ...register(name),
    error: Boolean(errors[name]),
    helperText: errors[name]?.message,
  });

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="md"
      fullWidth
    >
      <DialogHeader
        title={isEdit ? "Edit Organization" : "Add Organization"}
        onClose={handleCancel}
      />

      <DialogContent>
        <Box
          component="form"
          id="organization-form"
          className={styles.formGrid}
          onSubmit={handleSubmit(handleFormSubmit)}
          noValidate
        >
          <TextField
            label="Name"
            {...fieldProps("name")}
          />

          <TextField
            label="Contact Person"
            {...fieldProps("contactPerson")}
          />

          <TextField
            label="Email"
            type="email"
            {...fieldProps("email")}
          />

          <TextField
            label="Phone"
            {...fieldProps("phone")}
          />

          <TextField
            label="Telephone"
            {...fieldProps("telephone")}
          />

          {/* Address */}

          <div className={styles.sectionTitle}>
            Address
          </div>

          <TextField
            label="Street"
            className={styles.fullWidth}
            {...fieldProps("street")}
          />

          <TextField
            label="City"
            className={styles.fullWidth}
            {...fieldProps("city")}
          />

          {locationError && (
            <Alert
              severity="error"
              className={styles.fullWidth}
            >
              {locationError}
            </Alert>
          )}
        </Box>
      </DialogContent>

      <DialogActions className={styles.actions}>
        <Button
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          form="organization-form"
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Saving..."
            : isEdit
              ? "Update Organization"
              : "Add Organization"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
