import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    create: { email: 'demo@example.com', name: 'Demo User' },
    update: {},
  });

  // Resources
  const car = await prisma.resource.create({
    data: {
      type: 'car',
      name: 'City Car',
      rules: {
        unit: 'hour',
        min_duration_minutes: 60,
        max_duration_minutes: 8*60,
        slot_granularity_minutes: 60,
        buffer_before_minutes: 0,
        buffer_after_minutes: 0,
        lead_time_min_minutes: 60
      },
      pricing: {
        create: { unit: 'hour', basePrice: 1500 } // 15 EUR/h
      }
    }
  });

  const boat = await prisma.resource.create({
    data: {
      type: 'boat',
      name: 'SY Ostwind',
      rules: {
        unit: 'day',
        min_duration_days: 1,
        max_duration_days: 14,
        allow_partial_day: true,
        slot_granularity_minutes: 60,
        buffer_before_minutes: 120,
        buffer_after_minutes: 120
      },
      pricing: {
        create: { unit: 'day', basePrice: 18000 } // 180 EUR/day
      }
    }
  });

  console.log({ user, car, boat });
}

main().finally(() => prisma.$disconnect());
