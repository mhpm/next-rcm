'use client';

import React from 'react';
import { useForm, SubmitHandler, Controller, Control } from 'react-hook-form';
import {
  RiEyeLine,
  RiEyeOffLine,
  RiUpload2Line,
  RiKey2Fill,
} from 'react-icons/ri';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Link from 'next/link';
import { MemberFormData } from '@/types/member';

// 1. Definimos el tipo FormValues basado en MemberFormData pero con fechas como strings
type FormValues = Omit<MemberFormData, 'birthDate' | 'baptismDate'> & {
  birthDate?: string;
  baptismDate?: string;
};

// 2. Actualizamos la interfaz para usar FormValues
interface MemberFormProps {
  initialData?: Partial<FormValues>;
  onSubmit: SubmitHandler<FormValues>;
  isEditMode?: boolean;
  isSubmitting?: boolean;
}

// 3. Actualizamos el componente ImageUpload para usar FormValues
const ImageUpload = ({ control }: { control: Control<FormValues> }) => {
  const onDrop = useCallback(() => {
    // Files are handled by the form controller
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer
      ${isDragActive ? 'border-primary' : 'border-base-300'}`}
    >
      <Controller
        name="picture"
        control={control}
        render={({ field }) => (
          <input
            {...getInputProps()}
            onChange={(e) => field.onChange(e.target.files)}
          />
        )}
      />
      <RiUpload2Line className="mx-auto h-12 w-12 text-base-content/60" />
      <p>
        Arrastra y suelta tus archivos o <span className="link">Navega</span>
      </p>
    </div>
  );
};

export const MemberForm: React.FC<MemberFormProps> = ({
  initialData,
  onSubmit,
  isEditMode = false,
  isSubmitting = false,
}) => {
  // 4. Usamos FormValues en useForm
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: initialData,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const password = watch('password');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Izquierda */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Information */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title mb-4">Información Básica</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <fieldset>
                  <label className="label">
                    <span className="label-text">Nombre</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nombre"
                    className="input input-bordered w-full"
                    {...register('firstName', {
                      required: 'El nombre es requerido',
                    })}
                  />
                  {errors.firstName && (
                    <p className="text-error text-sm mt-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </fieldset>
                <fieldset>
                  <label className="label">
                    <span className="label-text">Apellido</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Apellido"
                    className="input input-bordered w-full"
                    {...register('lastName', {
                      required: 'El apellido es requerido',
                    })}
                  />
                  {errors.lastName && (
                    <p className="text-error text-sm mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </fieldset>
                <fieldset>
                  <label className="label">
                    <span className="label-text">Correo Electrónico</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Correo"
                    className="input input-bordered w-full"
                    {...register('email', {
                      required: 'El correo es requerido',
                    })}
                  />
                  {errors.email && (
                    <p className="text-error text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </fieldset>
                <fieldset>
                  <label className="label">
                    <span className="label-text">Teléfono</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="Teléfono"
                    className="input input-bordered w-full"
                    {...register('phone')}
                  />
                </fieldset>
                <fieldset>
                  <label className="label">
                    <span className="label-text">Edad</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Edad"
                    className="input input-bordered w-full"
                    {...register('age', {
                      required: 'La edad es requerida',
                      min: { value: 1, message: 'La edad debe ser mayor a 0' },
                      max: { value: 120, message: 'La edad debe ser menor a 120' },
                      valueAsNumber: true
                    })}
                  />
                  {errors.age && (
                    <p className="text-error text-sm mt-1">
                      {errors.age.message}
                    </p>
                  )}
                </fieldset>
                <fieldset>
                  <label className="label">
                    <span className="label-text">Fecha de Nacimiento</span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    {...register('birthDate')}
                  />
                </fieldset>
                <fieldset>
                  <label className="label">
                    <span className="label-text">Fecha de Bautismo</span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    {...register('baptismDate')}
                  />
                </fieldset>
                <fieldset className="md:col-span-2">
                  <label className="label">
                    <span className="label-text">Género</span>
                  </label>
                  <div className="flex items-center mt-2">
                    <label className="label cursor-pointer mr-4">
                      <input
                        type="radio"
                        value="MASCULINO"
                        className="radio"
                        {...register('gender', {
                          required: 'Seleccione un género',
                        })}
                      />
                      <span className="label-text ml-2">Masculino</span>
                    </label>
                    <label className="label cursor-pointer">
                      <input
                        type="radio"
                        value="FEMENINO"
                        className="radio"
                        {...register('gender')}
                      />
                      <span className="label-text ml-2">Femenino</span>
                    </label>
                  </div>
                  {errors.gender && (
                    <p className="text-error text-sm mt-1">
                      {errors.gender.message}
                    </p>
                  )}
                </fieldset>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title mb-4">Dirección</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <fieldset className="">
                  <label className="label">
                    <span className="label-text">Calle</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Calle"
                    className="input input-bordered w-full"
                    {...register('street')}
                  />
                </fieldset>
                <fieldset>
                  <label className="label">
                    <span className="label-text">Ciudad</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ciudad"
                    className="input input-bordered w-full"
                    {...register('city')}
                  />
                </fieldset>
                <fieldset>
                  <label className="label">
                    <span className="label-text">Estado</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Estado"
                    className="input input-bordered w-full"
                    {...register('state')}
                  />
                </fieldset>
                <fieldset>
                  <label className="label">
                    <span className="label-text">Código Postal</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Código Postal"
                    className="input input-bordered w-full"
                    {...register('zip')}
                  />
                </fieldset>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha */}
        <div className="space-y-8">
          {/* Image Upload */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title mb-4">Picture</h2>
              <ImageUpload control={control} />
            </div>
          </div>

          {/* Role & Ministerio */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title mb-4">Rol & Ministerio</h2>
              <fieldset>
                <label className="label">
                  <span className="label-text">Rol</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  {...register('role', { required: 'El rol es requerido' })}
                >
                  <option value="MIEMBRO">Miembro</option>
                  <option value="SUPERVISOR">Supervisor</option>
                  <option value="LIDER">Líder</option>
                  <option value="ANFITRION">Anfitrión</option>
                </select>
                {errors.role && (
                  <p className="text-error text-sm mt-1">
                    {errors.role.message}
                  </p>
                )}
              </fieldset>
              <fieldset>
                <label className="label">
                  <span className="label-text">Ministerio</span>
                </label>
                <input
                  type="text"
                  placeholder="Ministerio"
                  className="input input-bordered w-full"
                  {...register('ministerio')}
                />
              </fieldset>
            </div>
          </div>

          {/* Password */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title mb-4">
                {isEditMode ? 'Cambiar Contraseña' : 'Crear Contraseña'}
              </h2>
              <div className="space-y-4">
                <fieldset>
                  <label className="label">
                    <span className="label-text">Contraseña</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10">
                      <RiKey2Fill />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Contraseña"
                      className="input input-bordered w-full pl-10 pr-10"
                      {...register('password', {
                        required: !isEditMode
                          ? 'La contraseña es requerida'
                          : false,
                      })}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 z-10"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-error text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </fieldset>
                <fieldset>
                  <label className="label">
                    <span className="label-text">Confirmar Contraseña</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10">
                      <RiKey2Fill />
                    </span>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirmar Contraseña"
                      className="input input-bordered w-full pl-10 pr-10"
                      {...register('confirmPassword', {
                        validate: (value) =>
                          value === password || 'Las contraseñas no coinciden',
                      })}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 z-10"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-error text-sm mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </fieldset>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-8">
        <Link href="/members" className="btn btn-ghost">
          Cancelar
        </Link>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              {isEditMode ? 'Actualizando...' : 'Guardando...'}
            </>
          ) : (
            isEditMode ? 'Actualizar Miembro' : 'Guardar Cambios'
          )}
        </button>
      </div>
    </form>
  );
};
