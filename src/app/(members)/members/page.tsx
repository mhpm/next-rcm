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
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Miembros</h1>
        <div className="flex items-center gap-4">
          <Link href="/members/new" className="btn btn-primary">
            <RiAddLine />
            Añadir Miembro
          </Link>
          <Breadcrumbs />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="hidden sm:table w-full text-xs sm:text-sm md:text-base">
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
                <td className="flex flex-col sm:flex-row gap-2">
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
        <div className="sm:hidden flex flex-col gap-4">
          {members.map((member) => (
            <div key={member.id} className="card bg-white shadow-lg rounded-xl w-full border border-gray-200">
              <div className="card-body p-4 flex flex-col gap-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-100 text-blue-700 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                    {member.name.charAt(0)}
                  </div>
                  <h2 className="card-title text-base font-semibold text-gray-800">{member.name}</h2>
                </div>
                <div className="flex flex-col gap-1 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-600">Email:</span>
                    <span className="text-gray-700">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-600">Teléfono:</span>
                    <span className="text-gray-700">{member.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-600">Rol:</span>
                    <span className="text-gray-700">{member.role}</span>
                  </div>
                </div>
                <div className="card-actions flex justify-end mt-3 gap-2">
                  <Link href={`/members/${member.id}/edit`} className="btn btn-xs btn-outline btn-info">
                    <RiEdit2Line />
                  </Link>
                  <button className="btn btn-xs btn-outline btn-error">
                    <RiDeleteBinLine />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
