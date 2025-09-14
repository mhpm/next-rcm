export interface Member {
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
  };
  password?: string;
  birthDate?: Date;
  baptismDate?: Date;
  role: 'miembro' | 'supervisor' | 'lider' | 'anfitrion';
  gender: 'masculino' | 'femenino';
  ministerio: string;
  confirmPassword?: string;
  picture?: File[]; // react-dropzone usa File[]
}
