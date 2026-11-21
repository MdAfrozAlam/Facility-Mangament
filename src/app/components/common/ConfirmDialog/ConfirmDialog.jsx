import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from "@mui/material";

import styles from "./ConfirmDialog.module.css";

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  showCancel = true,
  onConfirm,
  onCancel,
}) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      // PaperProps={{
      //   className: styles.confirmDialog,
      // }}
    >
      <DialogTitle className={styles.dialogTitle}>
        {title}
      </DialogTitle>

      <DialogContent className={styles.dialogContent}>
        <Typography className={styles.dialogMessage}>
          {message}
        </Typography>
      </DialogContent>

      <DialogActions className={styles.dialogActions}>
        {showCancel && (
          <Button
            className={styles.cancelButton}
            onClick={onCancel}
          >
            {cancelText}
          </Button>
        )}

        <Button
          variant="contained"
          className={styles.confirmButton}
          onClick={onConfirm}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}