'use client';

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { FaLink } from 'react-icons/fa6';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

import {
  useEmailAvailability,
  useNetworks,
} from '@/app/(authenticated)/members/hooks/useMembers';
import { useDebounce } from '@/hooks/useDebounce';
import { useMinistries } from '@/app/(authenticated)/ministries/hooks/useMinistries';
import {
  InputField,
  SelectField,
  RadioGroupField,
  EmailField,
  MultiSelectField,
} from '@/components/FormControls';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  memberFormSchema,
  memberFormSchemaEdit,
  MemberFormInput,
} from '@/app/(authenticated)/members/schema/members.schema';

// Usamos el tipo de entrada del esquema (antes de transformaciones)
export type FormValues = MemberFormInput;

// 2. Actualizamos la interfaz para usar FormValues
interface MemberFormProps {
  initialData?: Partial<FormValues>;
  onSubmit: SubmitHandler<FormValues>;
  isEditMode?: boolean;
  isSubmitting?: boolean;
  title?: string;
  subtitle?: string;
  resetAfterSubmit?: boolean;
}

export const MemberForm: React.FC<MemberFormProps> = ({
  initialData,
  onSubmit,
  isEditMode = false,
  isSubmitting = false,
  title,
  subtitle,
  resetAfterSubmit = false,
}) => {
  // 4. Usamos FormValues en useForm
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    clearErrors,
    unregister,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      gender: 'MASCULINO',
      role: 'MIEMBRO',
      ...(initialData || {}),
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: zodResolver(isEditMode ? memberFormSchemaEdit : memberFormSchema),
    shouldUnregister: true,
  });

  // Reset form when initialData changes (for async data loading)
  useEffect(() => {
    if (initialData) {
      reset({ gender: 'MASCULINO', ...initialData });
    } else {
      reset({
        gender: 'MASCULINO',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        birthDate: '',
        baptismDate: '',
        role: 'MIEMBRO',
        ministries: [],
        notes: '',
      });
    }
  }, [initialData, reset]);

  // Asegurar que los ministerios iniciales queden en el estado del formulario
  useEffect(() => {
    if (initialData?.ministries && initialData.ministries.length > 0) {
      setValue('ministries', initialData.ministries, { shouldValidate: false });
    }
  }, [initialData?.ministries, setValue]);

  useEffect(() => {
    if (isEditMode) {
      // Logic for edit mode initialization if needed in future
    }
  }, [isEditMode, initialData, setValue, clearErrors, unregister]);

  // Hook para obtener ministerios
  // Cargar suficientes ministerios para asegurar que los seleccionados del miembro aparezcan
  const { data: ministriesData, isLoading: isLoadingMinistries } =
    useMinistries({ limit: 1000, offset: 0 });

  const { data: networksData, isLoading: isLoadingNetworks } = useNetworks();

  // Debug: log networks data
  useEffect(() => {
    console.log('Networks Data:', networksData);
  }, [networksData]);

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

    // En modo edición, si el email es el mismo que el original, no mostrar validación
    if (
      isEditMode &&
      initialData?.email &&
      debouncedEmail === initialData.email
    ) {
      return null;
    }

    if (isEmailAvailable === true) {
      return 'available';
    }

    if (isEmailAvailable === false) {
      return 'taken';
    }

    return null;
  }, [
    debouncedEmail,
    isCheckingEmail,
    emailCheckError,
    isEmailAvailable,
    isEditMode,
    initialData?.email,
  ]);

  // Preparar opciones de ministerios
  const ministryOptions = useMemo(() => {
    if (!ministriesData?.ministries) return [];
    return ministriesData.ministries.map((ministry) => ({
      value: ministry.id,
      label: ministry.name,
    }));
  }, [ministriesData]);

  // Preparar opciones de redes
  const networkOptions = useMemo(() => {
    if (!networksData || !Array.isArray(networksData)) return [];
    return networksData.map((network) => ({
      value: network.id,
      label: network.name,
    }));
  }, [networksData]);

  // Obtener valor actual de ministerios
  const currentMinistries = watch('ministries') || [];

  // Función para manejar cambios en ministerios
  const handleMinistriesChange = (values: string[]) => {
    setValue('ministries', values, { shouldValidate: true });
  };

  const onInternalSubmit = async (values: FormValues) => {
    try {
      await onSubmit(values);
      if (!isEditMode && resetAfterSubmit) {
        reset({ gender: 'MASCULINO' });
        clearErrors();
      }
    } catch {
      // No reset on error
    }
  };

  return (
    <form onSubmit={handleSubmit(onInternalSubmit)}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Izquierda */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              {title && <CardTitle>{title}</CardTitle>}
              {subtitle && <CardDescription>{subtitle}</CardDescription>}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField<FormValues>
                  name="firstName"
                  label="Nombre"
                  register={register}
                  rules={{ required: 'El nombre es requerido' }}
                  error={errors.firstName?.message}
                />
                <InputField<FormValues>
                  name="lastName"
                  label="Apellido"
                  register={register}
                  rules={{ required: 'El apellido es requerido' }}
                  error={errors.lastName?.message}
                />
                <EmailField<FormValues>
                  name="email"
                  label="Correo Electrónico"
                  register={register}
                  rules={{
                    validate: (value) => {
                      const v = typeof value === 'string' ? value : '';
                      if (!v) return true;
                      const ok =
                        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(v);
                      if (!ok) return 'Formato de correo inválido';
                      if (
                        isEditMode &&
                        initialData?.email &&
                        v === initialData.email
                      ) {
                        return true;
                      }
                      if (emailValidationStatus === 'taken') {
                        return 'Este correo ya está en uso';
                      }
                      return true;
                    },
                  }}
                  error={errors.email?.message}
                  validationStatus={emailValidationStatus}
                />
                <InputField<FormValues>
                  name="phone"
                  label="Teléfono"
                  type="tel"
                  register={register}
                />
                <InputField<FormValues>
                  name="age"
                  label="Edad"
                  type="number"
                  register={register}
                  error={errors.age?.message}
                />
                <InputField<FormValues>
                  name="birthDate"
                  label="Fecha de Nacimiento"
                  type="date"
                  register={register}
                  error={errors.birthDate?.message}
                />
                <InputField<FormValues>
                  name="baptismDate"
                  label="Fecha de Bautismo"
                  type="date"
                  register={register}
                  error={errors.baptismDate?.message}
                />
                <RadioGroupField<FormValues>
                  name="gender"
                  label="Género"
                  options={[
                    { label: 'Masculino', value: 'MASCULINO' },
                    { label: 'Femenino', value: 'FEMENINO' },
                  ]}
                  register={register}
                  rules={{ required: 'Seleccione un género' }}
                  error={errors.gender?.message}
                />
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader>
              <CardTitle>Dirección</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField<FormValues>
                  name="street"
                  label="Calle"
                  register={register}
                />
                <InputField<FormValues>
                  name="city"
                  label="Ciudad"
                  register={register}
                />
                <InputField<FormValues>
                  name="state"
                  label="Estado"
                  register={register}
                />
                <InputField<FormValues>
                  name="zip"
                  label="Código Postal"
                  register={register}
                />
                <InputField<FormValues>
                  name="country"
                  label="País"
                  register={register}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Columna Derecha */}
        <div className="space-y-8">
          {/* Image Upload */}
          {/* <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title mb-4">Picture</h2>
              <ImageUploadField<FormValues>
                name="picture"
                control={control}
                label="Foto del miembro"
              />
            </div>
          </div> */}

          {/* Role & Ministerio */}
          <Card>
            <CardHeader>
              <CardTitle>Rol</CardTitle>
            </CardHeader>
            <CardContent>
              <SelectField<FormValues>
                name="role"
                label="Rol"
                control={control}
                rules={{ required: 'El rol es requerido' }}
                error={errors.role?.message}
                options={[
                  { value: 'MIEMBRO', label: 'Miembro' },
                  { value: 'SUPERVISOR', label: 'Supervisor' },
                  { value: 'LIDER', label: 'Líder' },
                  { value: 'ANFITRION', label: 'Anfitrión' },
                  { value: 'PASTOR', label: 'Pastor' },
                  { value: 'TESORERO', label: 'Tesorero' },
                ]}
              />
              <SelectField
                name="network_id"
                control={control}
                label="Red"
                options={networkOptions}
                placeholder="Selecciona una red"
                disabled={isLoadingNetworks}
              />
              <MultiSelectField
                label="Ministerios"
                options={ministryOptions}
                value={currentMinistries}
                onChange={handleMinistriesChange}
                placeholder="Selecciona ministerios..."
                isLoading={isLoadingMinistries}
                error={errors.ministries?.message}
              />
              <div className="flex flex-wrap justify-start items-start gap-2 mt-2">
                <p className="text-sm text-muted-foreground">
                  ¿No se encuentra tu ministerio?
                </p>
                <Link href="/ministries" className="underline text-primary">
                  Agreagar nuevo ministerio <FaLink className="inline-block" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-8">
        <Button variant="ghost" asChild>
          <Link href="/members">Cancelar</Link>
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditMode ? 'Actualizando...' : 'Guardando...'}
            </>
          ) : isEditMode ? (
            'Actualizar Miembro'
          ) : (
            'Guardar Cambios'
          )}
        </Button>
      </div>
    </form>
  );
};
