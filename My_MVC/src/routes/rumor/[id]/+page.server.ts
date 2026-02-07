import { PrismaClient } from '@prisma/client';
import { fail } from '@sveltejs/kit';
// 👇 1. เพิ่มบรรทัดนี้ เพื่อดึง Type มาใช้
import type { PageServerLoad, Actions } from './$types';

const prisma = new PrismaClient();

// 👇 2. เติม ": PageServerLoad" หลัง load
export const load: PageServerLoad = async ({ params }) => {
  const rumor = await prisma.rumor.findUnique({
    where: { id: params.id },
    include: { reports: { include: { user: true } } }
  });
  
  const users = await prisma.user.findMany();
  
  // เช็คว่าถ้าหาไม่เจอ ให้ return null หรือ throw error (TypeScript จะได้ไม่บ่น)
  if (!rumor) throw new Error("Rumor not found");

  return { rumor, users };
};

// 👇 3. เติม ": Actions" หลัง actions
export const actions: Actions = {
  report: async ({ request, params }) => {
    const formData = await request.formData();
    const userId = Number(formData.get('userId'));
    const type = String(formData.get('type'));

    try {
      // 1. บันทึก Report
      await prisma.report.create({
        data: {
          rumorId: params.id,
          userId: userId,
          type: type
        }
      });

      // 2. เช็ค Panic
      const count = await prisma.report.count({ where: { rumorId: params.id } });
      if (count >= 3) {
        await prisma.rumor.update({
          where: { id: params.id },
          data: { status: 'panic' }
        });
      }

      return { success: true };
    } catch (error) {
      return fail(400, { message: 'เกิดข้อผิดพลาด หรือคุณเคยรายงานแล้ว' });
    }
  }
};