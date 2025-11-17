"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMemo, useEffect } from "react";
import Link from "next/link";
import { FaLink } from "react-icons/fa6";

import { useEmailAvailability } from "@/app/members/hooks/useMembers";
import { useDebounce } from "@/hooks/useDebounce";
import { useMinistries } from "@/app/ministries/hooks/useMinistries";
import {
  InputField,
  SelectField,
  RadioGroupField,
  PasswordField,
  EmailField,
  MultiSelectField,
} from "@/components/FormControls";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  memberFormSchema,
  MemberFormInput,
} from "@/app/members/schema/members.schema";

// Usamos el tipo de entrada del esquema (antes de transformaciones)
export type FormValues = MemberFormInput;

// 2. Actualizamos la interfaz para usar FormValues
interface MemberFormProps {
  initialData?: Partial<FormValues>;
  onSubmit: SubmitHandler<FormValues>;
  isEditMode?: boolean;
  isSubmitting?: boolean;
}

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
    trigger,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: initialData,
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(memberFormSchema),
  });

  // Reset form when initialData changes (for async data loading)
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  // Hook para obtener ministerios
  const { data: ministriesData, isLoading: isLoadingMinistries } =
    useMinistries();

  const password = watch("password");
  const emailValue = watch("email");

  // Toggle to show password fields only when needed
  const [changePassword, setChangePassword] = useState(!isEditMode);

  // Trigger immediate re-validation of confirmPassword when password changes
  useEffect(() => {
    trigger("confirmPassword");
  }, [password, trigger]);

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
    debouncedEmail || "",
    isEditMode ? currentMemberId : undefined
  );

  // Email validation status
  const emailValidationStatus = useMemo(() => {
    if (!debouncedEmail || debouncedEmail.length === 0) {
      return null;
    }

    if (isCheckingEmail) {
      return "checking";
    }

    if (emailCheckError) {
      return "error";
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
      return "available";
    }

    if (isEmailAvailable === false) {
      return "taken";
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

  // Obtener valor actual de ministerios
  const currentMinistries = watch("ministries") || [];

  // Función para manejar cambios en ministerios
  const handleMinistriesChange = (values: string[]) => {
    setValue("ministries", values, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Izquierda */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Information */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h3 className="card-title text-lg font-semibold text-base-content">
                Editar Miembro
              </h3>
              <p className="text-sm text-base-content/70 mb-2">
                {isEditMode
                  ? "Actualiza la información del miembro"
                  : "Ingresa los datos básicos del miembro"}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField<FormValues>
                  name="firstName"
                  label="Nombre"
                  register={register}
                  rules={{ required: "El nombre es requerido" }}
                  error={errors.firstName?.message}
                />
                <InputField<FormValues>
                  name="lastName"
                  label="Apellido"
                  register={register}
                  rules={{ required: "El apellido es requerido" }}
                  error={errors.lastName?.message}
                />
                <EmailField<FormValues>
                  name="email"
                  label="Correo Electrónico"
                  register={register}
                  rules={{
                    required: "El correo es requerido",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Formato de correo inválido",
                    },
                    validate: (value) => {
                      if (!value) return true;

                      // En modo edición, si el email es el mismo que el original, no validar
                      if (
                        isEditMode &&
                        initialData?.email &&
                        value === initialData.email
                      ) {
                        return true;
                      }

                      if (emailValidationStatus === "taken") {
                        return "Este correo ya está en uso";
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
                    { label: "Masculino", value: "MASCULINO" },
                    { label: "Femenino", value: "FEMENINO" },
                  ]}
                  register={register}
                  rules={{ required: "Seleccione un género" }}
                  error={errors.gender?.message}
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title mb-4">Dirección</h2>
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
            </div>
          </div>
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
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title mb-4">Rol</h2>
              <SelectField<FormValues>
                name="role"
                label="Rol"
                register={register}
                rules={{ required: "El rol es requerido" }}
                error={errors.role?.message}
                options={[
                  { value: "MIEMBRO", label: "Miembro" },
                  { value: "SUPERVISOR", label: "Supervisor" },
                  { value: "LIDER", label: "Líder" },
                  { value: "ANFITRION", label: "Anfitrión" },
                  { value: "PASTOR", label: "Pastor" },
                  { value: "TESORERO", label: "Tesorero" },
                ]}
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
                <p className="text-sm text-neutral-500">
                  ¿No se encuentra tu ministerio?
                </p>
                <Link href="/ministries" className="underline text-primary">
                  Agreagar nuevo ministerio <FaLink className="inline-block" />
                </Link>
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <h2 className="card-title">
                  {isEditMode ? "Cambiar Contraseña" : "Crear Contraseña"}
                </h2>
                {isEditMode && (
                  <label className="label cursor-pointer">
                    <span className="label-text mr-2">Editar</span>
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      checked={changePassword}
                      onChange={(e) => setChangePassword(e.target.checked)}
                    />
                  </label>
                )}
              </div>
              {changePassword && (
                <div className="space-y-4">
                  <PasswordField<FormValues>
                    name="password"
                    label={isEditMode ? "Nueva Contraseña" : "Contraseña"}
                    register={register}
                    rules={{
                      required: !isEditMode
                        ? "La contraseña es requerida"
                        : changePassword
                        ? "La contraseña es requerida"
                        : false,
                    }}
                    error={errors.password?.message}
                    placeholder="Contraseña"
                  />
                  <PasswordField<FormValues>
                    name="confirmPassword"
                    label="Confirmar Contraseña"
                    register={register}
                    rules={{
                      validate: (value) =>
                        !changePassword ||
                        value === password ||
                        "Las contraseñas no coinciden",
                    }}
                    error={errors.confirmPassword?.message}
                    placeholder="Confirmar Contraseña"
                  />
                </div>
              )}
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
              {isEditMode ? "Actualizando..." : "Guardando..."}
            </>
          ) : isEditMode ? (
            "Actualizar Miembro"
          ) : (
            "Guardar Cambios"
          )}
        </button>
      </div>
    </form>
  );
};
