'use client';

import { Breadcrumbs, MemberForm } from '@/components';
import { useCallback } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { Member } from '@/types/member';

// FormValues type to match MemberForm
type FormValues = Omit<Member, 'birthDate' | 'baptismDate'> & {
  birthDate?: string;
  baptismDate?: string;
};

export default function NewMemberPage() {
  // Usamos useCallback para memoizar la función y evitar re-renders innecesarios
  const handleSubmit: SubmitHandler<FormValues> = useCallback((data) => {
    console.log('Nuevo miembro:', data);
    alert('Miembro creado exitosamente (revisa la consola)');
  }, []); // El array de dependencias vacío asegura que la función se cree solo una vez

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Añadir Miembro</h1>
        <Breadcrumbs />
      </div>
      <MemberForm onSubmit={handleSubmit} />
    </div>
  );
}
