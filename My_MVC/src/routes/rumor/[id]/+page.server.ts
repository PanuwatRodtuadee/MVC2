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
    const password = String(formData.get('password') || ''); // <-- รับค่า Password

    // 1. ดึงข้อมูล User มาเช็คก่อน
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
        return fail(400, { message: 'ไม่พบผู้ใช้งาน' });
    }

    // ⭐ LOGIC ใหม่: ถ้าเป็น Auditor ต้องเช็ค Password
    if (user.role === 'auditor') {
        if (password !== user.password) {
            return fail(400, { message: '❌ รหัสผ่านสำหรับ Auditor ไม่ถูกต้อง!' });
        }
    }

    try {
      // (โค้ดบันทึก Report เดิมของคุณ...)
      await prisma.report.create({
        data: { rumorId: params.id, userId: userId, type: type }
      });
      
      // ... (ส่วนเช็ค Panic เหมือนเดิม) ...

      return { success: true };
    } catch (error) {
      return fail(400, { message: 'เกิดข้อผิดพลาด' });
    }
  }
};