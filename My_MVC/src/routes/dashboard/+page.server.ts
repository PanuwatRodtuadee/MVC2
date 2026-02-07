import { PrismaClient } from '@prisma/client';
import type { PageServerLoad } from './$types';
const prisma = new PrismaClient();

export const load: PageServerLoad = async () => {
  const panics = await prisma.rumor.findMany({ where: { status: 'panic' } });

  const verified = await prisma.rumor.findMany({
    where: {
        OR: [
            { credibility_score: { gte: 80 } },
            { credibility_score: { lte: 20 } }
        ]
    }
  });

  return { panics, verified };
};