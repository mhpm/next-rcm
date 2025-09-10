import { Drawer, Navbar } from '@/components';
import { DrawerItem } from '@/types';
import { RiDashboard3Line, RiGroup2Fill, RiUser3Fill } from 'react-icons/ri';
import { ROUTES } from '@/routes';

export default function Home({ children }: { children: React.ReactNode }) {
  const Items: DrawerItem[] = [
    {
      label: 'Dashboard',
      icon: <RiDashboard3Line size={26} />,
      href: ROUTES.DASHBOARD,
    },
    {
      label: 'Miembros',
      icon: <RiUser3Fill size={26} />,
      href: ROUTES.MEMBERS,
    },
    { label: 'Celulas', icon: <RiGroup2Fill size={26} />, href: ROUTES.CELLS },
    {
      label: 'Sectores',
      icon: <RiGroup2Fill size={26} />,
      href: ROUTES.SECTORS,
    },
    {
      label: 'Subsectores',
      icon: <RiGroup2Fill size={26} />,
      href: ROUTES.SUBSECTORS,
    },
    {
      label: 'Reportes',
      children: [
        { label: 'Semanal', href: ROUTES.REPORTS.WEEKLY },
        { label: 'Metas', href: ROUTES.REPORTS.GOALS },
        { label: 'Cuatrimestral', href: ROUTES.REPORTS.QUARTERLY },
        { label: 'Anual', href: ROUTES.REPORTS.ANNUAL },
      ],
    },
  ];

  return (
    <Drawer items={Items}>
      <Navbar />
      <main>{children}</main>
    </Drawer>
  );
}
