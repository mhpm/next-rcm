import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { generateUUID } from './uuid';

// Configuración para subida de archivos
const UPLOAD_DIR = 'public/uploads/members';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

/**
 * Guarda un archivo de imagen y retorna la URL pública
 */
export async function saveImageFile(file: File): Promise<string> {
  // Validar tipo de archivo
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Tipo de archivo no permitido. Solo se permiten imágenes JPG, PNG, GIF y WebP.');
  }

  // Validar tamaño de archivo
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('El archivo es demasiado grande. El tamaño máximo permitido es 5MB.');
  }

  // Crear directorio si no existe
  const uploadPath = join(process.cwd(), UPLOAD_DIR);
  await mkdir(uploadPath, { recursive: true });

  // Generar nombre único para el archivo
  const fileExtension = file.name.split('.').pop() || 'jpg';
  const fileName = `${generateUUID()}.${fileExtension}`;
  const filePath = join(uploadPath, fileName);

  // Convertir File a Buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Guardar archivo
  await writeFile(filePath, buffer);

  // Retornar URL pública
  return `/uploads/members/${fileName}`;
}

/**
 * Procesa un array de archivos y retorna la URL del primero
 */
export async function processImageUpload(files?: File[]): Promise<string | null> {
  if (!files || files.length === 0) {
    return null;
  }

  // Tomar solo el primer archivo
  const file = files[0];
  return await saveImageFile(file);
}