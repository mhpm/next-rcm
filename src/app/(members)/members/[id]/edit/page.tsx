'use client';

import { Breadcrumbs, MemberForm } from '@/components';
import { Member } from '@/types/member';
import { useMemo } from 'react';
import { SubmitHandler } from 'react-hook-form';

// FormValues type to match MemberForm
type FormValues = Omit<Member, 'birthDate' | 'baptismDate'> & {
  birthDate?: string;
  baptismDate?: string;
};

type PageProps = {
  params: {
    id: string;
  };
};

// Helper para formatear fechas a YYYY-MM-DD
const formatDateForInput = (date?: Date): string => {
  if (!date) return '';
  // Asegurarse de que la fecha se interpreta en UTC para evitar problemas de zona horaria
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const EditMemberPage = ({ params }: PageProps) => {
  // Usamos useMemo para evitar que memberData se cree en cada render
  const memberData = useMemo((): Partial<FormValues> => {
    // Datos de ejemplo que coinciden con la interfaz FormValues
    return {
      id: params.id,
      firstName: 'Pedro',
      lastName: 'Doe (Datos de ejemplo)',
      email: 'jane.doe@example.com',
      phone: '123-456-7890',
      age: 30,
      address: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'Anystate',
        zip: '12345',
      },
      // Formateamos las fechas al formato que el input[type=date] espera
      birthDate: formatDateForInput(new Date('1995-05-15')),
      baptismDate: formatDateForInput(new Date('2010-06-20')),
      role: 'miembro',
      gender: 'femenino',
      ministerio: 'Alabanza',
    };
  }, [params.id]);

  const handleSubmit: SubmitHandler<FormValues> = (data) => {
    console.log('Datos actualizados del miembro:', params.id, data);
    alert('Miembro actualizado exitosamente (revisa la consola)');
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Editar Miembro</h1>
        <Breadcrumbs />
      </div>
      <MemberForm
        initialData={memberData}
        onSubmit={handleSubmit}
        isEditMode={true}
      />
    </div>
  );
};

export default EditMemberPage;
