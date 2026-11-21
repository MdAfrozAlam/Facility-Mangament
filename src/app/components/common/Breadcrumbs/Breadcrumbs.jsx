"use client";

import NextLink from "next/link";
import {
  Breadcrumbs as MuiBreadcrumbs,
  Link as MuiLink,
  Typography,
} from "@mui/material";

import styles from "./Breadcrumbs.module.css";

/*
 * items: [{ label, href?, icon? }]
 * - Last item is the current page and is never a link.
 * - Items with an href navigate client-side.
 * - Items without an href are menu groups with no page of their own
 *   (e.g. "Core", "Asset Management") and render as plain text.
 */
export default function Breadcrumbs({ items = [] }) {
  if (!items.length) {
    return null;
  }

  return (
    <MuiBreadcrumbs
      className={styles.breadcrumbs}
      aria-label="breadcrumb"
    >
      {items.map((item, index) => {
        const key = `${item.label}-${index}`;
        const isCurrent = index === items.length - 1;

        if (isCurrent) {
          return (
            <Typography
              key={key}
              className={styles.current}
              aria-current="page"
            >
              {item.icon}
              <span>{item.label}</span>
            </Typography>
          );
        }

        if (item.href?.trim()) {
          return (
            <MuiLink
              key={key}
              component={NextLink}
              href={item.href}
              underline="hover"
              className={styles.link}
            >
              {item.icon}
              <span>{item.label}</span>
            </MuiLink>
          );
        }

        return (
          <Typography key={key} className={styles.group}>
            {item.icon}
            <span>{item.label}</span>
          </Typography>
        );
      })}
    </MuiBreadcrumbs>
  );
}
