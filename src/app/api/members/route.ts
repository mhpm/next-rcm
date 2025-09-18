import { NextRequest, NextResponse } from 'next/server';
import { Member } from '@/types';
import { generateUUID } from '@/lib/uuid';
import { members } from '@/mock';

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
