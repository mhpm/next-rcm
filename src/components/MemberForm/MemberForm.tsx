'use client';

import React from 'react';
import { useForm } from '@tanstack/react-form';
import type { FieldApi } from '@tanstack/react-form';
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
import type { MemberFormValues as MemberFormValuesType } from '@/app/members/types/member';
import { useEmailAvailability } from '@/app/members/hooks/useMembers';
import { useDebounce } from '@/hooks/useDebounce';

// 1. Definimos el tipo MemberFormValues reutilizando la definición global para mantener consistencia
export type MemberFormValues = MemberFormValuesType;

// 2. Actualizamos la interfaz para usar MemberFormValues
interface MemberFormProps {
  initialData?: Partial<MemberFormValues>;
  onSubmit: (values: MemberFormValues) => void | Promise<void>;
  isEditMode?: boolean;
  isSubmitting?: boolean;
}

// 3. Actualizamos el componente ImageUpload para usar MemberFormValues
const ImageUploadField = ({
  field,
}: {
  field: FieldApi<MemberFormValues, 'picture'>;
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const files = field.state.value;

    if (files && files.length > 0) {
      const file = files[0];
      const nextUrl = URL.createObjectURL(file);

      setPreviewUrl((prev) => {
        if (prev) {
          URL.revokeObjectURL(prev);
        }
        return nextUrl;
      });

      return () => {
        URL.revokeObjectURL(nextUrl);
      };
    }

    setPreviewUrl((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev);
      }
      return null;
    });
  }, [field.state.value]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        field.handleChange([file]);
        field.handleBlur();
      }
    },
    [field]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    multiple: false,
  });

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    field.handleChange([]);
    field.handleBlur();
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
            const filesArray = files ? Array.from(files) : [];
            field.handleChange(filesArray);
            field.handleBlur();
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
  const form = useForm<MemberFormValues>({
    defaultValues: {
      id: initialData?.id,
      firstName: initialData?.firstName ?? '',
      lastName: initialData?.lastName ?? '',
      email: initialData?.email ?? '',
      phone: initialData?.phone ?? '',
      age: initialData?.age,
      street: initialData?.street ?? '',
      city: initialData?.city ?? '',
      state: initialData?.state ?? '',
      zip: initialData?.zip ?? '',
      country: initialData?.country ?? '',
      birthDate: initialData?.birthDate ?? '',
      baptismDate: initialData?.baptismDate ?? '',
      role: initialData?.role ?? 'MIEMBRO',
      gender: initialData?.gender,
      ministerio: initialData?.ministerio ?? '',
      notes: initialData?.notes ?? '',
      skills: initialData?.skills ?? [],
      password: initialData?.password ?? '',
      confirmPassword: initialData?.confirmPassword ?? '',
      picture: initialData?.picture ?? [],
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  const { canSubmit, isSubmitting: formIsSubmitting, submitCount } =
    form.useStore((state) => ({
      canSubmit: state.canSubmit,
      isSubmitting: state.isSubmitting,
      submitCount: state.submitCount,
    }));

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const emailValue = form.useStore((state) => state.values.email ?? '');

  const getFieldError = useCallback(
    (field: FieldApi<MemberFormValues, keyof MemberFormValues>) =>
      field.state.meta.touchedErrors[0] ??
      (submitCount > 0 ? field.state.meta.errors[0] : undefined),
    [submitCount]
  );

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
  const baseEmailInputClass = 'input input-bordered w-full pr-10';
  const emailValidationClass = useMemo(() => {
    switch (emailValidationStatus) {
      case 'available':
        return 'input-success';
      case 'taken':
        return 'input-error';
      case 'error':
        return 'input-warning';
      default:
        return '';
    }
  }, [emailValidationStatus]);

  const isSubmitDisabled =
    isSubmitting ||
    formIsSubmitting ||
    !canSubmit ||
    emailValidationStatus === 'taken';

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Izquierda */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Information */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title mb-4">Información Básica</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <form.Field
                  name="firstName"
                  validators={{
                    onSubmit: ({ value }) =>
                      value && value.trim().length > 0
                        ? undefined
                        : 'El nombre es requerido',
                  }}
                >
                  {(field) => {
                    const errorMessage = getFieldError(field);
                    return (
                      <fieldset>
                        <label className="label">
                          <span className="label-text">Nombre</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Nombre"
                          className="input input-bordered w-full"
                          value={field.state.value ?? ''}
                          onChange={(event) => field.handleChange(event.target.value)}
                          onBlur={field.handleBlur}
                        />
                        {errorMessage ? (
                          <p className="text-error text-sm mt-1">{errorMessage}</p>
                        ) : null}
                      </fieldset>
                    );
                  }}
                </form.Field>
                <form.Field
                  name="lastName"
                  validators={{
                    onSubmit: ({ value }) =>
                      value && value.trim().length > 0
                        ? undefined
                        : 'El apellido es requerido',
                  }}
                >
                  {(field) => {
                    const errorMessage = getFieldError(field);
                    return (
                      <fieldset>
                        <label className="label">
                          <span className="label-text">Apellido</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Apellido"
                          className="input input-bordered w-full"
                          value={field.state.value ?? ''}
                          onChange={(event) => field.handleChange(event.target.value)}
                          onBlur={field.handleBlur}
                        />
                        {errorMessage ? (
                          <p className="text-error text-sm mt-1">{errorMessage}</p>
                        ) : null}
                      </fieldset>
                    );
                  }}
                </form.Field>
                <form.Field
                  name="email"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) {
                        return undefined;
                      }

                      const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
                      if (!emailPattern.test(value)) {
                        return 'Formato de correo inválido';
                      }

                      return undefined;
                    },
                    onSubmit: ({ value }) => {
                      if (!value || value.trim().length === 0) {
                        return 'El correo es requerido';
                      }

                      const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
                      if (!emailPattern.test(value)) {
                        return 'Formato de correo inválido';
                      }

                      if (emailValidationStatus === 'taken') {
                        return 'Este correo ya está en uso';
                      }

                      return undefined;
                    },
                  }}
                >
                  {(field) => {
                    const errorMessage = getFieldError(field);
                    const hasError = Boolean(errorMessage);
                    const inputClassName = [
                      baseEmailInputClass,
                      hasError ? 'input-error' : emailValidationClass,
                    ]
                      .filter(Boolean)
                      .join(' ');
                    return (
                      <fieldset>
                        <label className="label">
                          <span className="label-text">Correo Electrónico</span>
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            placeholder="Correo"
                            className={inputClassName}
                            value={field.state.value ?? ''}
                            onChange={(event) => field.handleChange(event.target.value)}
                            onBlur={field.handleBlur}
                          />

                          {/* Email validation icon */}
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            {emailValidationStatus === 'checking' && (
                              <RiLoader4Line className="w-5 h-5 text-gray-400 animate-spin" />
                            )}
                            {emailValidationStatus === 'available' && !hasError && (
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
                        {errorMessage ? (
                          <p className="text-error text-sm mt-1">{errorMessage}</p>
                        ) : null}
                        {emailValidationStatus === 'available' && !hasError && (
                          <p className="text-success text-sm mt-1">✓ Correo disponible</p>
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
                    );
                  }}
                </form.Field>
                <form.Field name="phone">
                  {(field) => (
                    <fieldset>
                      <label className="label">
                        <span className="label-text">Teléfono</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="Teléfono"
                        className="input input-bordered w-full"
                        value={field.state.value ?? ''}
                        onChange={(event) => field.handleChange(event.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </fieldset>
                  )}
                </form.Field>
                <form.Field
                  name="age"
                  validators={{
                    onSubmit: ({ value }) => {
                      if (value === undefined || value === null) {
                        return 'La edad es requerida';
                      }

                      if (value < 1) {
                        return 'La edad debe ser mayor a 0';
                      }

                      if (value > 120) {
                        return 'La edad debe ser menor a 120';
                      }

                      return undefined;
                    },
                  }}
                >
                  {(field) => {
                    const errorMessage = getFieldError(field);
                    return (
                      <fieldset>
                        <label className="label">
                          <span className="label-text">Edad</span>
                        </label>
                        <input
                          type="number"
                          placeholder="Edad"
                          className="input input-bordered w-full"
                          value={
                            field.state.value === undefined || field.state.value === null
                              ? ''
                              : field.state.value
                          }
                          onChange={(event) => {
                            const value = event.target.value;
                            if (value === '') {
                              field.handleChange(undefined);
                            } else {
                              field.handleChange(Number(value));
                            }
                          }}
                          onBlur={field.handleBlur}
                        />
                        {errorMessage ? (
                          <p className="text-error text-sm mt-1">{errorMessage}</p>
                        ) : null}
                      </fieldset>
                    );
                  }}
                </form.Field>
                <form.Field name="birthDate">
                  {(field) => (
                    <fieldset>
                      <label className="label">
                        <span className="label-text">Fecha de Nacimiento</span>
                      </label>
                      <input
                        type="date"
                        className="input input-bordered w-full"
                        value={field.state.value ?? ''}
                        onChange={(event) => field.handleChange(event.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </fieldset>
                  )}
                </form.Field>
                <form.Field name="baptismDate">
                  {(field) => (
                    <fieldset>
                      <label className="label">
                        <span className="label-text">Fecha de Bautismo</span>
                      </label>
                      <input
                        type="date"
                        className="input input-bordered w-full"
                        value={field.state.value ?? ''}
                        onChange={(event) => field.handleChange(event.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </fieldset>
                  )}
                </form.Field>
                <form.Field
                  name="gender"
                  validators={{
                    onSubmit: ({ value }) =>
                      value ? undefined : 'Seleccione un género',
                  }}
                >
                  {(field) => {
                    const errorMessage = getFieldError(field);
                    return (
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
                              checked={field.state.value === 'MASCULINO'}
                              onChange={() => field.handleChange('MASCULINO')}
                              onBlur={field.handleBlur}
                            />
                            <span className="label-text ml-2">Masculino</span>
                          </label>
                          <label className="label cursor-pointer">
                            <input
                              type="radio"
                              value="FEMENINO"
                              className="radio"
                              checked={field.state.value === 'FEMENINO'}
                              onChange={() => field.handleChange('FEMENINO')}
                              onBlur={field.handleBlur}
                            />
                            <span className="label-text ml-2">Femenino</span>
                          </label>
                        </div>
                        {errorMessage ? (
                          <p className="text-error text-sm mt-1">{errorMessage}</p>
                        ) : null}
                      </fieldset>
                    );
                  }}
                </form.Field>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title mb-4">Dirección</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <form.Field name="street">
                  {(field) => (
                    <fieldset>
                      <label className="label">
                        <span className="label-text">Calle</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Calle"
                        className="input input-bordered w-full"
                        value={field.state.value ?? ''}
                        onChange={(event) => field.handleChange(event.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </fieldset>
                  )}
                </form.Field>
                <form.Field name="city">
                  {(field) => (
                    <fieldset>
                      <label className="label">
                        <span className="label-text">Ciudad</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Ciudad"
                        className="input input-bordered w-full"
                        value={field.state.value ?? ''}
                        onChange={(event) => field.handleChange(event.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </fieldset>
                  )}
                </form.Field>
                <form.Field name="state">
                  {(field) => (
                    <fieldset>
                      <label className="label">
                        <span className="label-text">Estado</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Estado"
                        className="input input-bordered w-full"
                        value={field.state.value ?? ''}
                        onChange={(event) => field.handleChange(event.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </fieldset>
                  )}
                </form.Field>
                <form.Field name="zip">
                  {(field) => (
                    <fieldset>
                      <label className="label">
                        <span className="label-text">Código Postal</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Código Postal"
                        className="input input-bordered w-full"
                        value={field.state.value ?? ''}
                        onChange={(event) => field.handleChange(event.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </fieldset>
                  )}
                </form.Field>
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
              <form.Field name="picture">
                {(field) => <ImageUploadField field={field} />}
              </form.Field>
            </div>
          </div>

          {/* Role & Ministerio */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title mb-4">Rol & Ministerio</h2>
              <form.Field
                name="role"
                validators={{
                  onSubmit: ({ value }) =>
                    value ? undefined : 'El rol es requerido',
                }}
              >
                {(field) => {
                  const errorMessage = getFieldError(field);
                  return (
                    <fieldset>
                      <label className="label">
                        <span className="label-text">Rol</span>
                      </label>
                      <select
                        className="select select-bordered w-full"
                        value={field.state.value ?? 'MIEMBRO'}
                        onChange={(event) =>
                          field.handleChange(
                            event.target.value as MemberFormValues['role']
                          )
                        }
                        onBlur={field.handleBlur}
                      >
                        <option value="MIEMBRO">Miembro</option>
                        <option value="SUPERVISOR">Supervisor</option>
                        <option value="LIDER">Líder</option>
                        <option value="ANFITRION">Anfitrión</option>
                      </select>
                      {errorMessage ? (
                        <p className="text-error text-sm mt-1">{errorMessage}</p>
                      ) : null}
                    </fieldset>
                  );
                }}
              </form.Field>
              <form.Field name="ministerio">
                {(field) => (
                  <fieldset>
                    <label className="label">
                      <span className="label-text">Ministerio</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ministerio"
                      className="input input-bordered w-full"
                      value={field.state.value ?? ''}
                      onChange={(event) => field.handleChange(event.target.value)}
                      onBlur={field.handleBlur}
                    />
                  </fieldset>
                )}
              </form.Field>
            </div>
          </div>

          {/* Password */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title mb-4">
                {isEditMode ? 'Cambiar Contraseña' : 'Crear Contraseña'}
              </h2>
              <div className="space-y-4">
                <form.Field
                  name="password"
                  validators={{
                    onSubmit: ({ value }) =>
                      !isEditMode && (!value || value.length === 0)
                        ? 'La contraseña es requerida'
                        : undefined,
                  }}
                >
                  {(field) => {
                    const errorMessage = getFieldError(field);
                    return (
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
                            value={field.state.value ?? ''}
                            onChange={(event) => field.handleChange(event.target.value)}
                            onBlur={field.handleBlur}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-3 z-10"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                          </button>
                        </div>
                        {errorMessage ? (
                          <p className="text-error text-sm mt-1">{errorMessage}</p>
                        ) : null}
                      </fieldset>
                    );
                  }}
                </form.Field>
                <form.Field
                  name="confirmPassword"
                  validators={{
                    onChange: ({ value, form }) => {
                      const currentPassword = form.getFieldValue('password');
                      if (!value && !currentPassword) {
                        return undefined;
                      }

                      if (value !== currentPassword) {
                        return 'Las contraseñas no coinciden';
                      }

                      return undefined;
                    },
                    onSubmit: ({ value, form }) => {
                      const currentPassword = form.getFieldValue('password');
                      if (!currentPassword && !value) {
                        return undefined;
                      }

                      if (value !== currentPassword) {
                        return 'Las contraseñas no coinciden';
                      }

                      return undefined;
                    },
                  }}
                >
                  {(field) => {
                    const errorMessage = getFieldError(field);
                    return (
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
                            value={field.state.value ?? ''}
                            onChange={(event) => field.handleChange(event.target.value)}
                            onBlur={field.handleBlur}
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
                        {errorMessage ? (
                          <p className="text-error text-sm mt-1">{errorMessage}</p>
                        ) : null}
                      </fieldset>
                    );
                  }}
                </form.Field>
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
          disabled={isSubmitDisabled}
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
