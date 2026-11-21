"use client";
import { CircleUser,  LogOut ,ChevronDown ,UserPen,Wrench} from "lucide-react";
import ConfirmDialog from "../../common/ConfirmDialog/ConfirmDialog";
import { useState } from "react";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  PersonOutline,
  SettingsOutlined,
  
} from "@mui/material";



import styles from "./ProfileMenu.module.css";
import { redirect } from "next/navigation";

export default function ProfileMenu() {
   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  function handleLogout() {
    console.log("Logout Clicked");
    //window.location.reload();
    //redirect("/admin/login");
    window.location.href="/admin/login";
    
    

  }
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleClose();
    console.log("Profile clicked");
  };

  const handleSettings = () => {
    handleClose();
    console.log("Settings clicked");
  };

 

  return (
    <>
      {/* Profile Button */}

     <IconButton
  onClick={handleOpen}
  className={styles.profileButton}
  aria-label="Open profile menu"
>
  <CircleUser
    className={styles.profileIcon}
    size={26}
    strokeWidth={1.8}
    aria-hidden="true"
  />

  <span className={styles.profileText}>
    Hi, Admin!
  </span>
  
  <ChevronDown
    className={styles.chevron}
    size={16} color="white"
  />
</IconButton>

      {/* Profile Menu */}

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        className={styles.profileMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            className: styles.menuPaper,
          },
        }}
      >

        {/* User Information */}

        <Box className={styles.userInfo}>
          <Avatar className={styles.menuAvatar}>
            AA
          </Avatar>

          <Box className={styles.userDetails}>
            <Typography className={styles.userName}>
              Afroz Alam
            </Typography>

            <Typography className={styles.userRole}>
              Administrator
            </Typography>

            <Typography className={styles.userEmail}>
              afroz@example.com
            </Typography>
          </Box>
        </Box>

        <Divider className={styles.divider} />

        {/* Profile */}

        <MenuItem
          className={styles.menuItem}
          onClick={handleProfile}
        >
          <ListItemIcon className={styles.menuIcon}>
            <UserPen/>
          </ListItemIcon>

          <ListItemText
            primary="My Profile"
            slotProps={{
              primary: {
                className: styles.menuText,
              },
            }}
          />
        </MenuItem>

        {/* Settings */}

        <MenuItem
          className={styles.menuItem}
          onClick={handleSettings}
        >
          <ListItemIcon className={styles.menuIcon}>
             <Wrench/>
           
          </ListItemIcon>

          <ListItemText
            primary="Settings"
            slotProps={{
              primary: {
                className: styles.menuText,
              },
            }}
          />
        </MenuItem>

        <Divider className={styles.divider} />

        {/* Logout */}

        <MenuItem
          className={`${styles.menuItem} ${styles.logoutItem}`}
         onClick={() => setDeleteDialogOpen(true)}
          
          
        >
          <ListItemIcon className={styles.logoutIcon}>
           <LogOut/>
          </ListItemIcon>

          <ListItemText
            primary="Logout"
            slotProps={{
              primary: {
                className: styles.logoutText,
              },
            }}
          />
        </MenuItem>

      </Menu>

       {deleteDialogOpen && (
          <ConfirmDialog
            open={deleteDialogOpen}
            title="Logout"
            message="Are you sure you want to logout?"
            confirmText="Yes"
            cancelText="No"
            onConfirm={handleLogout}
            onCancel={() => setDeleteDialogOpen(false)}
          />
        )}
    </>
  );
}