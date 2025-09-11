'use client';

import { Breadcrumbs } from '@/components';
import Link from 'next/link';
import { useForm, SubmitHandler, Controller, Control } from 'react-hook-form';
import {
  RiEyeLine,
  RiEyeOffLine,
  RiUpload2Line,
  RiKey2Fill,
} from 'react-icons/ri';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

type FormValues = {
  name: string;
  email: string;
  mobile: string;
  verified: boolean;
  dob: string;
  gender: 'male' | 'female';
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  setAsPermanent: boolean;
  image?: File[];
  password: string;
  confirmPassword: string;
};

const ImageUpload = ({ control }: { control: Control<FormValues> }) => {
  const [files, setFiles] = useState<File[]>([]);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer
      ${isDragActive ? 'border-primary' : 'border-base-300'}`}
    >
      <Controller
        name="image"
        control={control}
        render={({ field }) => (
          <input
            {...getInputProps()}
            onChange={(e) => field.onChange(e.target.files)}
          />
        )}
      />

      <RiUpload2Line className="mx-auto h-12 w-12 text-base-content/60" />
      {isDragActive ? (
        <p>Suelta los archivos aquí...</p>
      ) : (
        <p>
          Arrastra y suelta tus archivos o <span className="link">Navega</span>
        </p>
      )}
      {files.length > 0 && (
        <div className="mt-4">
          <h4>Archivos seleccionados:</h4>
          <ul>
            {files.map((file) => (
              <li key={file.name}>
                {file.name} - {file.size} bytes
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default function NewMemberPage() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormValues>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log('Nuevo miembro:', data);
    alert('Miembro creado exitosamente (revisa la consola)');
  };

  const password = watch('password');

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Añadir Miembro</h1>
        <Breadcrumbs />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Information */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title mb-4">Información Básica</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <fieldset className="form-control">
                  <label className="label">
                    <span className="label-text">Nombre</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nombre"
                    className="input input-bordered"
                    {...register('name', {
                      required: 'El nombre es requerido',
                    })}
                  />
                  {errors.name && (
                    <span className="text-error text-sm mt-1">
                      {errors.name.message}
                    </span>
                  )}
                </fieldset>
                <fieldset className="form-control">
                  <label className="label">
                    <span className="label-text">Correo Electrónico</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Correo Electrónico"
                    className="input input-bordered"
                    {...register('email', {
                      required: 'El correo es requerido',
                    })}
                  />
                  {errors.email && (
                    <span className="text-error text-sm mt-1">
                      {errors.email.message}
                    </span>
                  )}
                </fieldset>
                <fieldset className="form-control">
                  <label className="label">
                    <span className="label-text">Móvil</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="(098) 765 4321"
                    className="input input-bordered"
                    {...register('mobile')}
                  />
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      className="toggle toggle-sm"
                      {...register('verified')}
                    />
                    <span className="label-text ml-2">Verificado</span>
                  </div>
                </fieldset>
                <fieldset className="form-control">
                  <label className="label">
                    <span className="label-text">Fecha de Nacimiento</span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered"
                    {...register('dob')}
                  />
                  <div className="flex items-center mt-4">
                    <label className="label cursor-pointer mr-4">
                      <input
                        type="radio"
                        value="male"
                        className="radio"
                        {...register('gender')}
                      />
                      <span className="label-text ml-2">Masculino</span>
                    </label>
                    <label className="label cursor-pointer">
                      <input
                        type="radio"
                        value="female"
                        className="radio"
                        {...register('gender')}
                      />
                      <span className="label-text ml-2">Femenino</span>
                    </label>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title mb-4">Dirección</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <fieldset className="form-control">
                  <label className="label">
                    <span className="label-text">Dirección</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Dirección"
                    className="input input-bordered"
                    {...register('streetAddress')}
                  />
                </fieldset>
                <fieldset className="form-control">
                  <label className="label">
                    <span className="label-text">Ciudad</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ciudad"
                    className="input input-bordered"
                    {...register('city')}
                  />
                </fieldset>
                <fieldset className="form-control">
                  <label className="label">
                    <span className="label-text">Estado</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Estado"
                    className="input input-bordered"
                    {...register('state')}
                  />
                </fieldset>
                <fieldset className="form-control">
                  <label className="label">
                    <span className="label-text">Código Postal</span>
                  </label>
                  <input
                    type="text"
                    placeholder="564-879"
                    className="input input-bordered"
                    {...register('postalCode')}
                  />
                </fieldset>
                <fieldset className="form-control md:col-span-2 self-end">
                  <label className="label cursor-pointer justify-start">
                    <input
                      type="checkbox"
                      className="checkbox"
                      {...register('setAsPermanent')}
                    />
                    <span className="label-text ml-2">
                      Establecer como permanente
                    </span>
                  </label>
                </fieldset>
              </div>
            </div>
          </div>

          {/* Upload Image */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title mb-4">Subir Imagen</h2>
              <ImageUpload control={control} />
            </div>
          </div>

          {/* Create Password */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title mb-4">Crear Contraseña</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <fieldset className="form-control">
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
                        required: 'La contraseña es requerida',
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
                    <span className="text-error text-sm mt-1">
                      {errors.password.message}
                    </span>
                  )}
                </fieldset>
                <fieldset className="form-control">
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
                        required: 'Por favor confirma la contraseña',
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
                    <span className="text-error text-sm mt-1">
                      {errors.confirmPassword.message}
                    </span>
                  )}
                </fieldset>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <Link href="/members" className="btn btn-ghost">
            Cancelar
          </Link>
          <button type="submit" className="btn btn-primary">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
