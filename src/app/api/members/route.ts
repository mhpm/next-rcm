import { NextRequest, NextResponse } from 'next/server';
import { Member } from '@/types';
import { generateUUID } from '@/lib/uuid';

// Sample member data
const members: Member[] = [
  {
    id: 'a1b2c3d4-e5f6-4789-a012-123456789abc',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '1234567890',
    age: 30,
    address: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
    },
    birthDate: '1990-01-01',
    baptismDate: '2020-01-01',
    role: 'miembro',
    gender: 'masculino',
    ministerio: 'Ministério A',
    notes: 'Miembro activo y comprometido',
    skills: ['Liderazgo', 'Música'],
  },
  {
    id: 'b2c3d4e5-f6a7-4890-b123-234567890bcd',
    firstName: 'Jesus',
    lastName: 'Martinez',
    email: 'jesus.martinez@example.com',
    phone: '0987654321',
    age: 25,
    address: {
      street: '456 Oak St',
      city: 'Othertown',
      state: 'CA',
      zip: '54321',
      country: 'USA',
    },
    birthDate: '1995-05-15',
    baptismDate: '2021-01-01',
    role: 'supervisor',
    gender: 'masculino',
    ministerio: 'Ministério B',
    notes: 'Supervisor de jóvenes',
    skills: ['Enseñanza', 'Tecnología'],
  },
  {
    id: 'c3d4e5f6-a7b8-4901-c234-345678901cde',
    firstName: 'Maria',
    lastName: 'Garcia',
    email: 'maria.garcia@example.com',
    phone: '5566778899',
    age: 35,
    address: {
      street: '789 Pine St',
      city: 'Somewhere',
      state: 'TX',
      zip: '67890',
      country: 'USA',
    },
    birthDate: '1988-08-20',
    baptismDate: '2019-03-15',
    role: 'lider',
    gender: 'femenino',
    ministerio: 'Ministério de Mujeres',
    notes: 'Líder del ministerio de mujeres',
    skills: ['Liderazgo', 'Consejería'],
  },
  {
    id: 'd4e5f6a7-b8c9-4012-d345-456789012def',
    firstName: 'Carlos',
    lastName: 'Rodriguez',
    email: 'carlos.rodriguez@example.com',
    phone: '3344556677',
    age: 28,
    address: {
      street: '321 Elm St',
      city: 'Anywhere',
      state: 'FL',
      zip: '13579',
      country: 'USA',
    },
    birthDate: '1995-12-10',
    baptismDate: '2022-06-01',
    role: 'anfitrion',
    gender: 'masculino',
    ministerio: 'Hospitalidad',
    notes: 'Nuevo miembro, muy entusiasta',
    skills: ['Hospitalidad', 'Cocina'],
  },
  {
    id: 'e5f6a7b8-c9d0-4123-e456-567890123efa',
    firstName: 'Ana',
    lastName: 'Lopez',
    email: 'ana.lopez@example.com',
    phone: '2233445566',
    age: 42,
    address: {
      street: '654 Maple St',
      city: 'Everywhere',
      state: 'NY',
      zip: '24680',
      country: 'USA',
    },
    birthDate: '1981-03-25',
    baptismDate: '2018-12-25',
    role: 'lider',
    gender: 'femenino',
    ministerio: 'Pastoral',
    notes: 'Pastora asociada',
    skills: ['Predicación', 'Consejería', 'Liderazgo'],
  },
];

// GET - Obtener todos los miembros
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const role = searchParams.get('role');
    const search = searchParams.get('search');

    let filteredMembers = [...members];

    // Filtrar por status (usando role como equivalente)
    if (status) {
      filteredMembers = filteredMembers.filter(
        (member) => member.role === status
      );
    }

    // Filtrar por role
    if (role) {
      filteredMembers = filteredMembers.filter(
        (member) => member.role === role
      );
    }

    // Filtrar por búsqueda (nombre, email)
    if (search) {
      const searchLower = search.toLowerCase();
      filteredMembers = filteredMembers.filter(
        (member) =>
          member.firstName.toLowerCase().includes(searchLower) ||
          member.lastName.toLowerCase().includes(searchLower) ||
          member.email.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({
      success: true,
      data: filteredMembers,
      total: filteredMembers.length,
    });
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear un nuevo miembro
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar datos requeridos
    if (!body.firstName || !body.lastName || !body.email) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Verificar si el email ya existe
    const existingMember = members.find(
      (member) => member.email === body.email
    );
    if (existingMember) {
      return NextResponse.json(
        { success: false, error: 'El email ya está registrado' },
        { status: 409 }
      );
    }

    // Crear nuevo miembro
    const newMember: Member = {
      id: generateUUID(),
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      age: body.age,
      address: body.address,
      birthDate: body.birthDate,
      baptismDate: body.baptismDate,
      role: body.role || 'miembro',
      gender: body.gender,
      ministerio: body.ministerio,
      notes: body.notes,
      skills: body.skills || [],
    };

    members.push(newMember);

    return NextResponse.json(
      {
        success: true,
        data: newMember,
        message: 'Miembro creado exitosamente',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating member:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
