"use client";

import { DialogTitle, IconButton } from "@mui/material";
import { X } from "lucide-react";

/*
 * Branded dialog title bar (theme primary color) with a close (X) button.
 * Use in place of <DialogTitle> inside an MUI <Dialog>.
 */
export default function DialogHeader({ title, onClose }) {
  return (
    <DialogTitle
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        py: 1.5,
        pr: 1.5,
        backgroundColor: "primary.main",
        color: "#ffffff",
        fontSize: 18,
        fontWeight: 600,

        // MUI removes the content's top padding after a DialogTitle; with a
        // filled header the content needs breathing room. "&&" out-ranks it.
        "&& + .MuiDialogContent-root": {
          pt: 2.5,
        },
      }}
    >
      <span>{title}</span>

      {onClose && (
        <IconButton
          onClick={onClose}
          aria-label="Close dialog"
          size="small"
          sx={{
            color: "#ffffff",
            "&:hover, &:focus-visible": {
              backgroundColor: "rgba(255, 255, 255, 0.16)",
            },
          }}
        >
          <X size={20} aria-hidden="true" />
        </IconButton>
      )}
    </DialogTitle>
  );
}
