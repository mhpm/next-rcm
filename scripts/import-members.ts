import 'dotenv/config';
import { PrismaClient, $Enums } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as XLSX from 'xlsx';
import fs from 'fs';

// Create the adapter for PostgreSQL
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

// Create the Prisma Client with the adapter
const prisma = new PrismaClient({
  adapter,
});

async function importMembers(filePath: string, churchId: string) {
  console.log(`🚀 Starting import from ${filePath} for church ${churchId}...`);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
  }

  // Verify church exists
  const church = await prisma.churches.findUnique({ where: { id: churchId } });
  if (!church) {
    console.error(`❌ Church not found: ${churchId}`);
    process.exit(1);
  }
  console.log(`⛪ Found church: ${church.name}`);

  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Convert sheet to JSON
  const data: any[] = XLSX.utils.sheet_to_json(worksheet);

  console.log(`📊 Found ${data.length} rows in the first sheet.`);
  if (data.length > 0) {
    console.log('🔍 First row keys (headers):', Object.keys(data[0]));
    console.log('🔍 First row data:', data[0]);
  }

  // Cache for networks: name -> id
  const networkCache = new Map<string, string>();

  // Pre-load existing networks
  const existingNetworks = await prisma.networks.findMany({
    where: { church_id: churchId },
  });
  for (const network of existingNetworks) {
    networkCache.set(network.name.toUpperCase(), network.id);
  }
  console.log(`🌐 Loaded ${networkCache.size} existing networks.`);

  let successCount = 0;
  let errorCount = 0;

  for (const [index, row] of data.entries()) {
    try {
      // Map row to Member data
      // Accepted headers (case insensitive logic can be added if needed, but here we check common ones)

      // Try to get separate first names first
      const name1 = row['nombre 1'] || row['Nombre 1'] || row['NOMBRE 1'] || '';

      const name2 = row['nombre 2'] || row['Nombre 2'] || row['NOMBRE 2'] || '';

      const combinedName = `${name1} ${name2}`.trim();

      const firstName =
        combinedName ||
        row['firstName'] ||
        row['firstname'] ||
        row['Nombre'] ||
        row['nombre'] ||
        row['First Name'] ||
        row['NOMBRES'] ||
        row['NOMBRE'];

      // Combine Last Names
      const lastName1 =
        row['APELLIDO PATERNO'] ||
        row['Apellido Paterno'] ||
        row['apellido paterno'] ||
        '';
      const lastName2 =
        row['APELLIDO MATERNO'] ||
        row['Apellido Materno'] ||
        row['apellido materno'] ||
        '';
      const lastName =
        `${lastName1} ${lastName2}`.trim() ||
        row['lastName'] ||
        row['lastname'] ||
        row['Apellido'] ||
        row['apellido'] ||
        row['Last Name'];

      const email =
        row['email'] ||
        row['Email'] ||
        row['Correo'] ||
        row['correo'] ||
        row['CORREO'];

      // Phone: convert to string
      let phone =
        row['phone'] ||
        row['Phone'] ||
        row['Telefono'] ||
        row['telefono'] ||
        row['Celular'] ||
        row['celular'];
      if (phone) phone = String(phone);

      const memberData: any = {
        firstName,
        lastName,
        email: email ? String(email).toLowerCase() : null,
        phone,
        church_id: churchId,
        // Defaults
        role: $Enums.MemberRole.MIEMBRO,
        gender: $Enums.Gender.MASCULINO,
      };

      if (!memberData.firstName || !memberData.lastName) {
        console.warn(
          `⚠️ Skipping row ${
            index + 2
          } (Excel row): Missing firstName or lastName`
        );
        errorCount++;
        continue;
      }

      // Handle Gender
      const genderRaw =
        row['gender'] ||
        row['Gender'] ||
        row['Genero'] ||
        row['Género'] ||
        row['genero'] ||
        row['sexo'] ||
        row['SEXO'];
      if (genderRaw) {
        const g = String(genderRaw).toUpperCase();
        if (g.includes('FEM') || g === 'F' || g === 'MUJER') {
          memberData.gender = $Enums.Gender.FEMENINO;
        }
      }

      // Handle Age
      const ageRaw = row['age'] || row['Age'] || row['Edad'] || row['edad'];
      if (ageRaw) memberData.age = Number(ageRaw);

      // Handle Network (RED)
      const networkRaw =
        row['RED'] ||
        row['red'] ||
        row['Red'] ||
        row['Network'] ||
        row['network'];
      if (networkRaw) {
        const networkName = String(networkRaw).trim();
        const networkNameUpper = networkName.toUpperCase();

        if (networkName) {
          let networkId = networkCache.get(networkNameUpper);

          if (!networkId) {
            console.log(`\n🆕 Creating new network: "${networkName}"`);
            const newNetwork = await prisma.networks.create({
              data: {
                name: networkName,
                church_id: churchId,
              },
            });
            networkId = newNetwork.id;
            networkCache.set(networkNameUpper, networkId);
          }

          memberData.network_id = networkId;
        }
      }

      // Upsert by email if present
      if (memberData.email) {
        await prisma.members.upsert({
          where: { email: memberData.email },
          update: {
            ...memberData,
            // Don't overwrite some fields if you prefer, but here we update everything provided
          },
          create: memberData,
        });
      } else {
        // Create without email
        await prisma.members.create({
          data: memberData,
        });
      }

      successCount++;
      process.stdout.write(
        `\r✅ Imported: ${successCount} / ❌ Errors: ${errorCount}`
      );
    } catch (error) {
      console.error(`\n❌ Error on row ${index + 2}:`, error);
      errorCount++;
    }
  }

  console.log(`\n\n✨ Import completed!`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
}

// Get args
const args = process.argv.slice(2);
if (args.length < 2) {
  console.log(
    '\nUsage: npx tsx scripts/import-members.ts <file_path.xlsx> <church_id>'
  );
  console.log('\nExample:');
  console.log(
    '  npx tsx scripts/import-members.ts ./data/members.xlsx cm12345678'
  );
  process.exit(0);
}

const [filePathArg, churchIdArg] = args;
importMembers(filePathArg, churchIdArg)
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
