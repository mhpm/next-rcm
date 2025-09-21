import { getDatabaseConnection } from '../lib/database';
import { members } from './membersMock';

// Seed function for a specific church database
async function seedChurchDatabase(churchSlug: string) {
  console.log(`🌱 Starting database seed for church: ${churchSlug}...`);

  const prisma = getDatabaseConnection(churchSlug);

  // Clear existing members for this church database
  await prisma.member.deleteMany({});

  console.log('🧹 Cleared existing members');

  // Create members with proper data transformation
  for (const memberData of members) {
    const transformedMember = {
      firstName: memberData.firstName,
      lastName: memberData.lastName,
      email: memberData.email,
      phone: memberData.phone || null,
      age: memberData.age || null,
      
      // Address fields (already flat in new structure)
      street: memberData.street || null,
      city: memberData.city || null,
      state: memberData.state || null,
      zip: memberData.zip || null,
      country: memberData.country || 'México',
      
      // Dates
      birthDate: memberData.birthDate || null,
      baptismDate: memberData.baptismDate || null,
      
      // Enums (already in correct format)
      role: memberData.role,
      gender: memberData.gender,
      
      // Other fields
      ministerio: memberData.ministerio || 'General',
      pictureUrl: memberData.pictureUrl || null,
      notes: memberData.notes || null,
      skills: memberData.skills || [],
      passwordHash: memberData.passwordHash || null,
    };

    await prisma.member.create({
      data: transformedMember,
    });
  }

  console.log(`✅ Created ${members.length} members for church: ${churchSlug}`);
  console.log('🎉 Database seed completed successfully!');
}

// Main function to seed multiple churches or a specific one
async function main() {
  const churchSlug = process.argv[2] || 'demo';
  
  try {
    await seedChurchDatabase(churchSlug);
  } catch (error) {
    console.error(`❌ Seed failed for church ${churchSlug}:`, error);
    throw error;
  }
}

main()
  .then(async () => {
    console.log('✅ Seed process completed');
    process.exit(0);
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  });
