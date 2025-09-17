import { NextRequest, NextResponse } from 'next/server';
import { Member } from '@/types';

// This would typically come from a database
// For now, we'll import the sample data from the main members route
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
];

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET /api/members/[id] - Get a specific member
export async function GET(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Member ID is required' },
        { status: 400 }
      );
    }

    const member = members.find((m) => m.id === id);

    if (!member) {
      return NextResponse.json(
        { success: false, error: 'Member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: member,
    });
  } catch (error) {
    console.error('Error fetching member:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/members/[id] - Update a specific member
export async function PUT(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Member ID is required' },
        { status: 400 }
      );
    }

    const memberIndex = members.findIndex((m) => m.id === id);

    if (memberIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Member not found' },
        { status: 404 }
      );
    }

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Update the member
    const updatedMember: Member = {
      ...members[memberIndex],
      ...body,
      id, // Ensure ID doesn't change
    };

    members[memberIndex] = updatedMember;

    return NextResponse.json({
      success: true,
      data: updatedMember,
      message: 'Member updated successfully',
    });
  } catch (error) {
    console.error('Error updating member:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/members/[id] - Delete a specific member
export async function DELETE(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Member ID is required' },
        { status: 400 }
      );
    }

    const memberIndex = members.findIndex((m) => m.id === id);

    if (memberIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Member not found' },
        { status: 404 }
      );
    }

    // Remove the member
    const deletedMember = members.splice(memberIndex, 1)[0];

    return NextResponse.json({
      success: true,
      data: deletedMember,
      message: 'Member deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting member:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}