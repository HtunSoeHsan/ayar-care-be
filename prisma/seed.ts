import { PrismaClient } from '@prisma/client';
import { diseaseMapping } from '../src/config/disease-mapping';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.treatment.deleteMany();
  await prisma.detection.deleteMany();
  await prisma.plantDisease.deleteMany();

  // Insert diseases and their treatments from the mapping
  for (const disease of diseaseMapping) {
    const { treatments, classIndex, ...diseaseData } = disease;
    const createdDisease = await prisma.plantDisease.create({
      data: {
        ...diseaseData,
        treatments: {
          create: treatments
        }
      }
    });
    console.log(`Created disease: ${createdDisease.name} (Class ${classIndex})`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 