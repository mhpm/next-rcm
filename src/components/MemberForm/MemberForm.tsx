'use client';

import React from 'react';
import { useForm, SubmitHandler, Controller, Control, ControllerRenderProps } from 'react-hook-form';
import {
  RiEyeLine,
  RiEyeOffLine,
  RiUpload2Line,
  RiKey2Fill,
  RiCheckLine,
  RiCloseLine,
  RiLoader4Line,
} from 'react-icons/ri';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import Link from 'next/link';
import Image from 'next/image';
import { MemberFormData } from '@/app/members/types/member';
import { useEmailAvailability } from '@/app/members/hooks/useMembers';
import { useDebounce } from '@/hooks/useDebounce';

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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="space-y-4">
      <Controller
        name="picture"
        control={control}
        render={({ field }) => {
          // Move hooks outside of render prop by creating a separate component
          return <ImageUploadField field={field} previewUrl={previewUrl} setPreviewUrl={setPreviewUrl} />;
        }}
      />
    </div>
  );
};

const ImageUploadField = ({ 
  field, 
  previewUrl, 
  setPreviewUrl 
}: { 
  field: ControllerRenderProps<FormValues, 'picture'>; 
  previewUrl: string | null; 
  setPreviewUrl: (url: string | null) => void; 
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      // Update form field
      field.onChange([file]);
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }, [field, setPreviewUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    multiple: false,
  });

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    field.onChange([]);
  };

  return (
    <>
      {previewUrl ? (
        <div className="relative">
          <Image
            src={previewUrl}
            alt="Vista previa"
            className="w-full h-48 object-cover rounded-lg border-2 border-base-300"
            width={384}
            height={192}
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 btn btn-circle btn-sm btn-error"
          >
            <RiCloseLine className="w-4 h-4" />
          </button>
        </div>
      ) : null}

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors
        ${
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-base-300 hover:border-primary/50'
        }`}
      >
        <input
          {...getInputProps()}
          onChange={(e) => {
            const files = e.target.files;
            // Convert FileList to Array
            const filesArray = files ? Array.from(files) : [];
            field.onChange(filesArray);
            if (files && files.length > 0) {
              const file = files[0];
              const url = URL.createObjectURL(file);
              setPreviewUrl(url);
            }
          }}
        />
        <RiUpload2Line className="mx-auto h-12 w-12 text-base-content/60" />
        <p className="mt-2">
          {previewUrl
            ? 'Arrastra una nueva imagen o haz clic para cambiar'
            : 'Arrastra y suelta tus archivos o'}{' '}
          <span className="link">Navega</span>
        </p>
        <p className="text-sm text-base-content/60 mt-1">
          Formatos soportados: JPG, PNG, GIF, WebP
        </p>
      </div>
    </>
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
  const emailValue = watch('email');

  // Debounce email value to avoid excessive API calls
  const debouncedEmail = useDebounce(emailValue, 500);

  // Get member ID for edit mode (to exclude current member from email check)
  const currentMemberId = initialData?.id;

  // Email availability check
  const {
    data: isEmailAvailable,
    isLoading: isCheckingEmail,
    error: emailCheckError,
  } = useEmailAvailability(
    debouncedEmail || '',
    isEditMode ? currentMemberId : undefined
  );

  // Email validation status
  const emailValidationStatus = useMemo(() => {
    if (!debouncedEmail || debouncedEmail.length === 0) {
      return null;
    }

    if (isCheckingEmail) {
      return 'checking';
    }

    if (emailCheckError) {
      return 'error';
    }

    if (isEmailAvailable === true) {
      return 'available';
    }

    if (isEmailAvailable === false) {
      return 'taken';
    }

    return null;
  }, [debouncedEmail, isCheckingEmail, emailCheckError, isEmailAvailable]);

  // Email input class based on validation status
  const emailInputClass = useMemo(() => {
    const baseClass = 'input input-bordered w-full pr-10';

    switch (emailValidationStatus) {
      case 'available':
        return `${baseClass} input-success`;
      case 'taken':
        return `${baseClass} input-error`;
      case 'error':
        return `${baseClass} input-warning`;
      default:
        return baseClass;
    }
  }, [emailValidationStatus]);

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
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Correo"
                      className={emailInputClass}
                      {...register('email', {
                        required: 'El correo es requerido',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Formato de correo inválido',
                        },
                        validate: (value) => {
                          if (!value) return true;

                          // Only validate availability if we have a result
                          if (emailValidationStatus === 'taken') {
                            return 'Este correo ya está en uso';
                          }

                          return true;
                        },
                      })}
                    />

                    {/* Email validation icon */}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      {emailValidationStatus === 'checking' && (
                        <RiLoader4Line className="w-5 h-5 text-gray-400 animate-spin" />
                      )}
                      {emailValidationStatus === 'available' && (
                        <RiCheckLine className="w-5 h-5 text-success" />
                      )}
                      {emailValidationStatus === 'taken' && (
                        <RiCloseLine className="w-5 h-5 text-error" />
                      )}
                      {emailValidationStatus === 'error' && (
                        <RiCloseLine className="w-5 h-5 text-warning" />
                      )}
                    </div>
                  </div>

                  {/* Email validation messages */}
                  {errors.email && (
                    <p className="text-error text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                  {emailValidationStatus === 'available' && !errors.email && (
                    <p className="text-success text-sm mt-1">
                      ✓ Correo disponible
                    </p>
                  )}
                  {emailValidationStatus === 'taken' && (
                    <p className="text-error text-sm mt-1">
                      ✗ Este correo ya está en uso
                    </p>
                  )}
                  {emailValidationStatus === 'error' && (
                    <p className="text-warning text-sm mt-1">
                      ⚠ Error al verificar disponibilidad
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
                      max: {
                        value: 120,
                        message: 'La edad debe ser menor a 120',
                      },
                      valueAsNumber: true,
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
          ) : isEditMode ? (
            'Actualizar Miembro'
          ) : (
            'Guardar Cambios'
          )}
        </button>
      </div>
    </form>
  );
};
