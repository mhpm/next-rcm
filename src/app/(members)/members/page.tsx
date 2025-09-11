import { Breadcrumbs } from '@/components';
import Link from 'next/link';
import { RiAddLine, RiDeleteBinLine, RiEdit2Line } from 'react-icons/ri';

const members = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    role: 'Líder de Célula',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '098-765-4321',
    role: 'Miembro',
  },
  // Agrega más miembros aquí
];

export default function MembersPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Miembros</h1>
        <div className="flex items-center gap-4">
          <Link href="/members/new" className="btn btn-primary">
            <RiAddLine />
            Añadir Miembro
          </Link>
          <Breadcrumbs />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td>{member.name}</td>
                <td>{member.email}</td>
                <td>{member.phone}</td>
                <td>{member.role}</td>
                <td className="flex gap-2">
                  <Link
                    href={`/members/${member.id}/edit`}
                    className="btn btn-sm btn-ghost"
                  >
                    <RiEdit2Line />
                  </Link>
                  <button className="btn btn-sm btn-ghost text-error">
                    <RiDeleteBinLine />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
