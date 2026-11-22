"use client";

import { useEffect } from "react";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
} from "@mui/material";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { internalUserSchema } from "../../../schemas/internalUserSchema";

import DialogHeader from "../../common/DialogHeader/DialogHeader";

import styles from "./InternalUserDialog.module.css";

const defaultValues = {
  roleCode: "",
  roleName: "",
  roleAccessCode: "",
  roleAccessName: "",
};

const toFormValues = (user) => ({
  roleCode: user.roleCode ?? "",
  roleName: user.roleName ?? "",
  roleAccessCode: user.roleAccessCode ?? "",
  roleAccessName: user.roleAccessName ?? "",
});

/*
 * Add / Edit internal user dialog.
 * Pass `user` to edit an existing one, leave it empty to add.
 */
export default function InternalUserDialog({
  open,
  user = null,
  onClose,
  onSubmit,
}) {
  const isEdit = Boolean(user);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(internalUserSchema),
    defaultValues,
    mode: "onSubmit",
  });

  /*
   * Fill the form when the dialog opens, clear it when it closes
   */
  useEffect(() => {
    reset(open && user ? toFormValues(user) : defaultValues);
  }, [open, user, reset]);

  const handleCancel = () => {
    if (isSubmitting) return;

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
      maxWidth="sm"
      fullWidth
    >
      <DialogHeader
        title={isEdit ? "Edit Internal User" : "New Internal User"}
        onClose={handleCancel}
      />

      <DialogContent>
        <Box
          component="form"
          id="internal-user-form"
          className={styles.formGrid}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <TextField
            label="Role Code"
            {...fieldProps("roleCode")}
          />

          <TextField
            label="Role Name"
            {...fieldProps("roleName")}
          />

          <TextField
            label="Role Access Code"
            {...fieldProps("roleAccessCode")}
          />

          <TextField
            label="Role Access Name"
            {...fieldProps("roleAccessName")}
          />
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
          form="internal-user-form"
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Saving..."
            : isEdit
              ? "Update"
              : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
