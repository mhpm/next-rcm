'use client';

import { useDrawer } from './useDrawer';
import { RiDashboard3Line, RiUser3Fill, RiGroup2Fill } from 'react-icons/ri';

type Props = {
  children: React.ReactNode;
};

export const Drawer = ({ children }: Props) => {
  const isOpen = useDrawer((s) => s.isDrawerOpen);

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
      <div className="drawer-side">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 min-h-full h-80 rounded-box w-56">
          <li>
            <a>
              <RiDashboard3Line size={26} />
              Dashboard
            </a>
          </li>
          <li>
            <a>
              <RiUser3Fill size={26} />
              Miembros
            </a>
          </li>
          <li>
            <a>
              <RiGroup2Fill size={26} />
              Celulas
            </a>
          </li>
          <li>
            <a>
              <RiGroup2Fill size={26} />
              Sectores
            </a>
          </li>
          <li>
            <a>
              <RiGroup2Fill size={26} />
              SubSectores
            </a>
          </li>
          <li>
            <h2 className="menu-title">Reportes</h2>
            <ul>
              <li>
                <a>Semanal</a>
              </li>
              <li>
                <a>Metas</a>
              </li>
              <li>
                <a>Cuatrimestral</a>
              </li>
              <li>
                <a>Anual</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};
