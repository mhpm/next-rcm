'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Control,
  Controller,
  ControllerRenderProps,
  FieldValues,
  Path,
} from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { RiUpload2Line, RiCloseLine } from 'react-icons/ri';

type ImageUploadFieldProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
};

export function ImageUploadField<T extends FieldValues>({ name, control, label = 'Picture' }: ImageUploadFieldProps<T>) {
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
      {label ? <h3 className="text-sm font-medium text-base-content/70">{label}</h3> : null}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <InternalImageUpload<T> field={field} previewUrl={previewUrl} setPreviewUrl={setPreviewUrl} />
        )}
      />
    </div>
  );
}

function InternalImageUpload<T extends FieldValues>({
  field,
  previewUrl,
  setPreviewUrl,
}: {
  field: ControllerRenderProps<T, Path<T>>;
  previewUrl: string | null;
  setPreviewUrl: (url: string | null) => void;
}) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        // Update form field
        field.onChange([file]);
        // Create preview URL
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    },
    [field, setPreviewUrl]
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
            ? 'Arrastra una imagen nueva o haz clic para cambiarla'
            : 'Arrastra una imagen aquí o haz clic para seleccionar'}
        </p>
        <p className="text-xs text-base-content/60 mt-1">PNG, JPG, GIF o WEBP (máx. 10MB)</p>
      </div>
    </>
  );
}

export default ImageUploadField;