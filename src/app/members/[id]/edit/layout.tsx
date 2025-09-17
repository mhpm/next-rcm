import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Editar Miembro | Sistema de Gestión de Miembros',
  description: 'Editar información de miembro en el sistema de gestión de la iglesia',
  robots: {
    index: false, // Don't index edit pages
    follow: false,
  },
};

export default function EditMemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}