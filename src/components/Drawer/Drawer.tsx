'use client';

import Link from 'next/link';
import { useDrawer } from './useDrawer';
import { DrawerItem } from '@/types';

// using shared DrawerItem from src/types

type Props = {
  children: React.ReactNode;
  items?: DrawerItem[];
};

export const Drawer = ({ children, items }: Props) => {
  const isOpen = useDrawer((s) => s.isDrawerOpen);
  const toggleDrawer = useDrawer((s) => s.toggleDrawer);

  // default menu (keeps previous structure)
  const defaultItems: DrawerItem[] = [];

  const menuItems = items ?? defaultItems;

  const handleClick = (e: React.MouseEvent, item: DrawerItem) => {
    const href = item.href;
    const isExternal = href ? /^https?:\/\//.test(href) : false;

    // call custom handler first
    item.onClick?.();

    // if external link, prevent default and handle navigation
    if (href && isExternal) {
      e.preventDefault();
      if (item.target === '_blank') window.open(href, '_blank');
      else window.location.href = href;
    }

    // if no href provided (plain action), prevent default
    if (!href) e.preventDefault();

    // close drawer after selection/navigation
    if (isOpen) toggleDrawer();
  };

  const renderItem = (item: DrawerItem, idx: number) => (
    <li key={item.id ?? `${item.label}-${idx}`} role="menuitem">
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
          href={item.href ?? '#'}
          onClick={(e) => handleClick(e, item)}
          target={item.target}
          className="flex items-center"
        >
          {item.icon}
          <span className="ml-2 text-lg md:text-xl">{item.label}</span>
        </a>
      )}

      {item.children && (
        <ul>
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
                  href={child.href ?? '#'}
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

  return (
    <div className={`drawer min-h-screen ${isOpen ? 'drawer-open' : ''}`}>
      <input
        id="my-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={isOpen}
        readOnly
      />
      <div className="drawer-content flex flex-col">{children}</div>
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
