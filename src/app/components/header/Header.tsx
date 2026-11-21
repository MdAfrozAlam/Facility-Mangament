import styles from "./Header.module.css";
import qydra from "../../assets/img/qydra-light.png";
import Image from "next/image";
import { CircleUser, Menu, LogOut } from "lucide-react";
import { useState } from "react";
import ConfirmDialog from "../common/ConfirmDialog/ConfirmDialog";
import ProfileMenu from "../common/menu/ProfileMenu";

type HeaderProps = {
  isSidebarOpen?: boolean;
  onSidebarToggle?: () => void;
};

export default function Header({
  isSidebarOpen = false,
  onSidebarToggle,
}: HeaderProps) {
 

  return (
    <header>
      <div className={styles.container}>
        <div className={styles.brand}>
          {onSidebarToggle && (
            <button
              type="button"
              className={styles.menuButton}
              onClick={onSidebarToggle}
              aria-label={
                isSidebarOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={isSidebarOpen}
            >
              <Menu size={24} aria-hidden="true" />
            </button>
          )}
          <Image className={styles.logo} src={qydra} alt="Qydra" />
        </div>

        <div
          // onClick={() => setDeleteDialogOpen(true)}
          // className={styles.profile}
        >
          {/* <CircleUser
            className={styles.profileIcon}
            size={28}
            aria-hidden="true"
          />
          <span>Hi Afroz!</span> */}
          <ProfileMenu />
        </div>

       
      </div>
    </header>
  );
}
