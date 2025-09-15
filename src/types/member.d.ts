export interface Member extends Record<string, unknown> {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country?: string;
  };
  birthDate?: string;
  baptismDate?: string;
  role: 'miembro' | 'supervisor' | 'lider' | 'anfitrion';
  gender: 'masculino' | 'femenino';
  ministerio: string;
  password?: string;
  confirmPassword?: string;
  picture?: File[]; // react-dropzone usa File[]
  notes?: string;
  skills?: string[];
}
