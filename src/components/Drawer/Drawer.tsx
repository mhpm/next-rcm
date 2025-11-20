"use client";

import { useState } from "react";
import Link from "next/link";
import { useDrawer } from "./useDrawer";
import { DrawerItem } from "@/types";
import {
  FaPeopleRoof,
  FaUserGroup,
  FaUsersGear,
  FaUsers,
  FaPersonChalkboard,
} from "react-icons/fa6";
import { RiDashboard3Fill } from "react-icons/ri";
import { ROUTES } from "@/routes";

// using shared DrawerItem from src/types
const Items: DrawerItem[] = [
  {
    label: "Dashboard",
    icon: <RiDashboard3Fill size={24} className="text-primary" />,
    href: ROUTES.DASHBOARD,
  },
  {
    label: "Miembros",
    icon: <FaUserGroup size={24} className="text-primary" />,
    href: ROUTES.MEMBERS,
  },
  {
    label: "Celulas",
    icon: <FaPeopleRoof size={24} className="text-primary" />,
    href: ROUTES.CELLS,
  },
  {
    label: "Sectores",
    icon: <FaUsersGear size={24} className="text-primary" />,
    href: ROUTES.SECTORS,
  },
  {
    label: "Subsectores",
    icon: <FaUsers size={24} className="text-primary" />,
    href: ROUTES.SUBSECTORS,
  },
  {
    label: "Ministries",
    icon: <FaPersonChalkboard size={24} className="text-primary" />,
    href: ROUTES.MINISTRIES,
  },
  {
    label: "Reportes",
    children: [
      { label: "Semanal", href: ROUTES.REPORTS.WEEKLY },
      { label: "Metas", href: ROUTES.REPORTS.GOALS },
      { label: "Cuatrimestral", href: ROUTES.REPORTS.QUARTERLY },
      { label: "Anual", href: ROUTES.REPORTS.ANNUAL },
    ],
  },
];

type Props = {
  children: React.ReactNode;
  items?: DrawerItem[];
};

export const Drawer = ({ children, items = Items }: Props) => {
  const isOpen = useDrawer((s) => s.isDrawerOpen);
  const toggleDrawer = useDrawer((s) => s.toggleDrawer);
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  // default menu (keeps previous structure)
  const defaultItems: DrawerItem[] = [];

  const menuItems = items ?? defaultItems;

  const handleParentClick = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleClick = (e: React.MouseEvent, item: DrawerItem) => {
    const href = item.href;
    const isExternal = href ? /^https?:\/\//.test(href) : false;

    // call custom handler first
    item.onClick?.();

    // if external link, prevent default and handle navigation
    if (href && isExternal) {
      e.preventDefault();
      if (item.target === "_blank") window.open(href, "_blank");
      else window.location.href = href;
    }

    // if no href provided (plain action), prevent default
    if (!href) e.preventDefault();

    // close drawer after selection/navigation
    if (isOpen) toggleDrawer();
  };

  console.log("🚀 ~ handleClick ~ isOpen:", isOpen);

  const renderItem = (item: DrawerItem, idx: number) => {
    const id = item.id ?? `${item.label}-${idx}`;
    const isItemOpen = openItems[id] ?? false;

    if (item.children && item.children.length > 0) {
      return (
        <li key={id}>
          <button
            onClick={() => handleParentClick(id)}
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center">
              {item.icon}
              <span className="ml-2 text-lg md:text-xl">{item.label}</span>
            </div>
            <span
              className={`transform transition-transform ${
                isItemOpen ? "rotate-90" : ""
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </button>
          {isItemOpen && (
            <ul className="pl-4">
              {item.children.map((child, i) => (
                <li key={`${child.label}-${i}`}>
                  {child.href && !/^https?:\/\//.test(child.href) ? (
                    <Link
                      href={child.href}
                      onClick={(e) => handleClick(e, child)}
                      className="text-lg"
                    >
                      {child.label}
                    </Link>
                  ) : (
                    <a
                      href={child.href ?? "#"}
                      onClick={(e) => handleClick(e, child)}
                      target={child.target}
                      className="text-lg"
                    >
                      {child.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </li>
      );
    }

    return (
      <li key={id} role="menuitem">
        {item.href && !/^https?:\/\//.test(item.href) ? (
          <Link
            href={item.href}
            onClick={(e) => handleClick(e, item)}
            className="flex items-center"
          >
            {item.icon}
            <span className="ml-2 text-lg md:text-xl">{item.label}</span>
          </Link>
        ) : (
          <a
            href={item.href ?? "#"}
            onClick={(e) => handleClick(e, item)}
            target={item.target}
            className="flex items-center"
          >
            {item.icon}
            <span className="ml-2 text-lg md:text-xl">{item.label}</span>
          </a>
        )}
      </li>
    );
  };

  return (
    <div className={`drawer min-h-screen ${isOpen ? "drawer-open" : ""}`}>
      <input
        id="my-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={isOpen}
        readOnly
      />
      <div className="drawer-content flex flex-col bg-base-200">{children}</div>
      <nav className="drawer-side">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
          onClick={toggleDrawer}
        ></label>
        <ul
          className="menu bg-base-200 min-h-full h-80 rounded-box w-56"
          role="menu"
        >
          {menuItems.map((it, i) => renderItem(it, i))}
        </ul>
      </nav>
    </div>
  );
};
