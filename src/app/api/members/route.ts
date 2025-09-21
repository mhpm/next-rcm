import { NextRequest, NextResponse } from 'next/server';
import { getAllMembers, createMember } from '@/app/members/actions/members.actions';
import { MemberFormData } from '@/types/member';
import { MemberRole } from '@/generated/prisma';

// GET /api/members - Get all members
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0;
    const search = searchParams.get('search') || undefined;
    const role = searchParams.get('role') as MemberRole || undefined;
    const orderBy = searchParams.get('orderBy') as 'firstName' | 'lastName' | 'createdAt' || 'lastName';
    const orderDirection = searchParams.get('orderDirection') as 'asc' | 'desc' || 'asc';

    const result = await getAllMembers({
      limit,
      offset,
      search,
      role,
      orderBy,
      orderDirection,
    });

    return NextResponse.json({
      success: true,
      data: result.members,
      total: result.total,
      hasMore: result.hasMore,
    });
  } catch (error) {
    console.error('Error in GET /api/members:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch members',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST /api/members - Create a new member
export async function POST(request: NextRequest) {
  try {
    const body: MemberFormData = await request.json();
    
    const member = await createMember(body);

    return NextResponse.json({
      success: true,
      data: member,
      message: 'Member created successfully',
    });
  } catch (error) {
    console.error('Error in POST /api/members:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create member',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}