import React from 'react';

export type DrawerItem = {
  id?: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  target?: string;
  onClick?: () => void;
  children?: DrawerItem[];
};
