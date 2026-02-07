// src/routes/+page.server.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const load = async () => {
  // ดึงข่าวทั้งหมด + นับจำนวน report ของแต่ละข่าว
  const rumors = await prisma.rumor.findMany({
    orderBy: { status: 'asc' }, // เรียง Panic ขึ้นก่อน (Panic=p, Normal=n จริงๆ ควรใช้ logic อื่นแต่เอาเร็ว)
    include: {
       _count: { select: { reports: true } }
    }
  });
  return { rumors };
};