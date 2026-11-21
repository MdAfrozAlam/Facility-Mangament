"use client";

import {
  Breadcrumbs,
  Link as MuiLink,
  Typography,
} from "@mui/material";

import styles from "./PageHeader.module.css";

export default function PageHeader({
  title,
  subtitle,
  actions,
}) {
  return (
    <>
      <div className={styles.header}>
        <div className={styles.titleSubtitle}>
          <h3 className={styles.pageTitleHeadeing}>
            {title}
          </h3>

          {subtitle && (
            <p className={styles.pageTitleSubheading}>
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div className={styles.actions}>
            {actions}
          </div>
        )}
      </div>

      
    </>
  );
}