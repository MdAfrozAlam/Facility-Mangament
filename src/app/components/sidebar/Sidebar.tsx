"use client";

import Link from "next/link";
import {
  Box,
  Collapse,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import {
  BarChart3,
  Boxes,
  BriefcaseBusiness,
  CalendarCheck,
  CalendarClock,
  CalendarCog,
  CalendarPlus,
  Grid3x3,
  CalendarRange,
  ClipboardList,
  FileChartColumn,
  Send,
  FileOutput,
  ScrollText,
  ClipboardPlus,
  FolderKanban,
  LayoutDashboard,
  MapPinned,
  Package,
  Tags,
  UsersRound,
  Wrench,
  ChevronDown,
  ChevronUp,
  Settings,
  UserCog,
  Building,
  Building2,
  ToggleLeft,
  ToggleRight,
  X,
  type LucideIcon,
  Weight,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import companyLogo from "../../assets/img/CRIF-HIGH_MARK_LOGO.svg";
import { color } from "chart.js/helpers";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
};

type MenuItem = {
  title: string;
  icon: LucideIcon;
  path: string;
  children?: MenuItem[];
};

const compactWidth = 68;
const expandedWidth = 250;
const headerHeight = 60;

const menuItems: MenuItem[] = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
 
  {
    title: "Planned Maintenance",
    icon: CalendarCog,
    path: "/admin/planned-maintenance",
    children: [
      {
        title: "PM Scheduler",
        icon: CalendarRange,
        path: "/admin/planned-maintenance/pm-scheduler",
        children: [
          {
            title: "Create New",
            icon: CalendarPlus,
            path: "/admin/planned-maintenance/pm-scheduler/createNew",
          },
          {
            title: "Scheduler Grid",
            icon: Grid3x3,
            path: "/admin/planned-maintenance/pm-scheduler/scheduler",
          },
        ],
      },
      {
        title: "PM Planner",
        icon: CalendarClock,
        path: "/admin/planned-maintenance/pm-planner",
        children: [
          {
            title: "Planner",
            icon: ClipboardList,
            path: "/admin/planned-maintenance/pm-planner/planner",
          },
          {
            title: "Planner Grid",
            icon: Grid3x3,
            path: "/admin/planned-maintenance/pm-planner/planner-grid",
          },
        ],
      },
      {
        title: "PM Issuer",
        icon: Send,
        path: "/admin/planned-maintenance/pm-issuer",
        children: [
          {
            title: "Issuer",
            icon: FileOutput,
            path: "/admin/planned-maintenance/pm-issuer/issuer",
          },
          {
            title: "Issuer Grid",
            icon: Grid3x3,
            path: "/admin/planned-maintenance/pm-issuer/issuer-grid",
          },
        ],
      },
      {
        title: "PM Log",
        icon: ScrollText,
        path: "/admin/planned-maintenance/pm-log",
        children: [
          {
            title: "Add PM Log",
            icon: ClipboardPlus,
            path: "/admin/planned-maintenance/pm-log/add-pm-log",
          },
          {
            title: "All Work Order",
            icon: ClipboardList,
            path: "/admin/planned-maintenance/pm-log/all-work-order",
          },
        ],
      },
    ],
  },
  {
    title: "Reactive Work",
    icon: Wrench,
    path: "/admin/reactive-work",
    children: [
      {
        title: "Add Reactive Work",
        icon: ClipboardPlus,
        path: "/admin/reactive-work/add-reactive-work",
      },
      {
        title: "All Work Order",
        icon: ClipboardList,
        path: "/admin/reactive-work/work-orders",
      },
    ],
  },
  {
    title: "Asset Management",
    icon: BriefcaseBusiness,
    path: "/admin/assets",
    children: [
      { title: "Asset Register", icon: Package, path: "/admin/asset-register" },
      { title: "Asset Categories", icon: Tags, path: "/admin/assets/categories" },
    ],
  },
 
  {
    title: "Reports & Insights",
    icon: BarChart3,
    path: "/admin/reports",
    children: [
     
      { title: "Assets Report", icon: Boxes, path: "/admin/reports/assets-report" },
      { title: "PPM Report", icon: CalendarCheck, path: "/admin/reports/ppm-report" },
      
    ],
  },
  {
    title: "Core",
    icon: Settings,
    path: "/admin/core",
    children: [
      {
        title: "Administration",
        icon: UserCog,
        path: "/admin/core/administration",
        children: [
          { title: "Accounts", icon: Building, path: "/admin/core/administration/accounts" },
          { title: "Projects", icon: FolderKanban, path: "/admin/core/administration/projects" },
        ],
      },
      { title: "Organization", icon: Building2, path: "/admin/core/organization" },
    ],
  },
];

type NavItemProps = {
  item: MenuItem;
  depth: number;
  showLabels: boolean;
  expandedMenus: string[];
  onToggle: (path: string) => void;
  onNavigate: () => void;
};

function NavItem({ item, depth, showLabels, expandedMenus, onToggle, onNavigate }: NavItemProps) {
  const { title, icon: Icon, path, children } = item;
  const hasChildren = Boolean(children?.length);
  const isExpanded = expandedMenus.includes(path);
  const isTopLevel = depth === 0;
  const submenuId = `submenu${path.replace(/\//g, "-")}`;

  return (
    <ListItem disablePadding sx={{ display: "block", mb: isTopLevel ? 0.5 : 0 }}>
      <ListItemButton
        {...(hasChildren
          ? {
              onClick: () => onToggle(path),
              "aria-expanded": isExpanded,
              "aria-controls": submenuId,
            }
          : { component: Link, href: path, onClick: onNavigate })}
        sx={
          isTopLevel
            ? {
                minHeight: 44,
                px: 1.25,
                borderRadius: 2,
                color: "#475569",
                "&:hover, &:focus-visible": {
                  color: "#003671",
                  backgroundColor: "#eaf4ff",
                },
              }
            : { minHeight: 40, pl: 5.5 + (depth - 1) * 2, pr: 1.25, borderRadius: 2, color: "#64748b" }
        }
      >
        <ListItemIcon sx={{ minWidth: isTopLevel ? 44 : 32, color: "inherit" }}>
          <Icon size={isTopLevel ? 21 : 17} aria-hidden="true" />
        </ListItemIcon>
        <ListItemText
          primary={title}
          sx={
            isTopLevel
              ? {
                  minWidth: 0,
                  opacity: showLabels ? 1 : 0,
                  transition: "opacity 120ms ease",
                  whiteSpace: "nowrap",
                }
              : undefined
          }
          slotProps={{ primary: { sx: { fontSize: isTopLevel ? 14 : 13, fontWeight: 500 } } }}
        />
        {hasChildren && showLabels && (isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />)}
      </ListItemButton>

      {hasChildren && (
        <Collapse in={showLabels && isExpanded} timeout="auto" unmountOnExit>
          <List id={submenuId} disablePadding>
            {children?.map((child) => (
              <NavItem
                key={child.path}
                item={child}
                depth={depth + 1}
                showLabels={showLabels}
                expandedMenus={expandedMenus}
                onToggle={onToggle}
                onNavigate={onNavigate}
              />
            ))}
          </List>
        </Collapse>
      )}
    </ListItem>
  );
}

export default function Sidebar({ isOpen, onClose, onToggle }: SidebarProps) {
  const isMobile = useMediaQuery("(max-width:767px)", { noSsr: true });
  const [isHovered, setIsHovered] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  // isOpen = pinned (toggled from header or sidebar). Hover only previews the
  // expanded sidebar over the content; it never pins or unpins it.
  const isExpanded = isMobile || isOpen || isHovered;
  const paperWidth = isExpanded ? expandedWidth : compactWidth;
  const reservedWidth = isMobile ? 0 : isOpen ? expandedWidth : compactWidth;
  const isHoverPreview = !isMobile && !isOpen && isHovered;

  // When unpinning, the cursor is still over the sidebar; drop the hover
  // preview so it collapses to icons now and re-expands on the next hover.
  const handleToggle = () => {
    if (isOpen) setIsHovered(false);
    onToggle();
  };

  // Pinned desktop sidebar stays open after navigating; mobile drawer closes.
  const handleNavigate = () => {
    if (isMobile) onClose();
  };

  const toggleMenu = (path: string) => {
    setExpandedMenus((menus) =>
      menus.includes(path) ? menus.filter((menu) => menu !== path) : [...menus, path],
    );
  };

  return (
    <Drawer
      anchor="left"
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? isOpen : true}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      slotProps={{
        backdrop: {
          sx: {
            top: `${headerHeight}px`,
          },
        },
        paper: {
          onMouseEnter: () => setIsHovered(true),
          onMouseLeave: () => setIsHovered(false),
          sx: {
            position: isMobile ? "fixed" : "relative",
            top: isMobile ? `${headerHeight}px` : 0,
            height: isMobile ? `calc(100% - ${headerHeight}px)` : "100%",
            width: paperWidth,
            overflowX: "hidden",
            borderRight: "1px solid #e2e8f0",
            boxSizing: "border-box",
            boxShadow: isHoverPreview ? "4px 0 16px rgba(15, 23, 42, 0.12)" : "none",
            transition: (theme) => theme.transitions.create(["width", "box-shadow"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.shortest,
            }),
          },
        },
      }}
      sx={{
        width: reservedWidth,
        flexShrink: 0,
        transition: (theme) => theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.shortest,
        }),
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: isExpanded ? "space-between" : "center",
          gap: 1,
          minHeight: 64,
          px: 1.25,
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        {isExpanded && (
          // <Image
          //   src={companyLogo}
          //   alt="CRIF High Mark"
          //   unoptimized
          //   style={{ width: "auto", height: 36, maxWidth: 170 }}
          // />
          <h3  style={{color:"#003671", fontWeight:'800'}}>QAYDRA FM</h3>
        )}
        <IconButton
          onClick={isMobile ? onClose : handleToggle}
          aria-label={isMobile ? "Close navigation menu" : isOpen ? "Collapse sidebar" : "Keep sidebar open"}
          aria-pressed={isMobile ? undefined : isOpen}
          title={isMobile ? "Close" : isOpen ? "Collapse sidebar" : "Keep sidebar open"}
          size="small"
          sx={{
            color: isOpen ? "#003671" : "#94a3b8",
            "&:hover, &:focus-visible": { color: "#003671", backgroundColor: "#eaf4ff" },
          }}
        >
          {isMobile ? (
            <X size={20} />
          ) : isOpen ? (
            <ToggleRight size={26} strokeWidth={1.8} />
          ) : (
            <ToggleLeft size={26} strokeWidth={1.8} />
          )}
        </IconButton>
      </Box>

      <List component="nav" aria-label="Main navigation" sx={{ px: 1.25, py: 1.75 }}>
        {menuItems.map((item) => (
          <NavItem
            key={item.path}
            item={item}
            depth={0}
            showLabels={isExpanded}
            expandedMenus={expandedMenus}
            onToggle={toggleMenu}
            onNavigate={handleNavigate}
          />
        ))}
      </List>
    </Drawer>
  );
}
