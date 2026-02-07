import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const load = async () => {
  // 1. ดึงข่าว Panic
  const panics = await prisma.rumor.findMany({ where: { status: 'panic' } });

  // 2. ดึงข่าว Verified (สมมติว่าคะแนน > 80 คือจริง, < 20 คือเท็จ)
  const verified = await prisma.rumor.findMany({
    where: {
        OR: [
            { credibility_score: { gte: 80 } }, // จริงมาก
            { credibility_score: { lte: 20 } }  // ปลอมมาก (ถือว่าตรวจสอบแล้วเหมือนกัน)
        ]
    }
  });

  return { panics, verified };
};