import { Breadcrumbs } from '@/components';
import React from 'react';

type PageProps = {
  params: {
    id: string;
  };
};

const MemberDetailsPage = ({ params }: PageProps) => {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Editar Miembro</h1>
        <Breadcrumbs />
      </div>
      <p className="text-lg mb-6">
        Editando detalles para el miembro con ID:{' '}
        <span className="font-mono bg-base-200 px-2 py-1 rounded">
          {params.id}
        </span>
      </p>

      <div className="space-y-6">
        <div className="card bg-base-100 shadow-xl border">
          <div className="card-body">
            <h2 className="card-title">Información Personal</h2>
            <p><strong>Nombre:</strong> Jane Doe (Mock Data)</p>
            <p><strong>Correo Electrónico:</strong> jane.doe@example.com (Mock Data)</p>
            <p><strong>Teléfono:</strong> (555) 123-4567 (Mock Data)</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl border">
          <div className="card-body">
            <h2 className="card-title">Estado de Membresía</h2>
            <p><strong>Estado:</strong> Activo (Mock Data)</p>
            <p><strong>Miembro Desde:</strong> 15 de Enero, 2023 (Mock Data)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetailsPage;