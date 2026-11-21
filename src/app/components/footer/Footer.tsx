import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <nav className={styles.links} aria-label="Legal">
        <button type="button" className={styles.link}>
          Privacy Policy
        </button>
        <span className={styles.separator} aria-hidden="true">
          •
        </span>
        <button type="button" className={styles.link}>
          Terms &amp; Conditions
        </button>
      </nav>

      <p className={styles.copyright}>
        © 2026 QAYDRA. All rights reserved.
      </p>
    </footer>
  );
}
