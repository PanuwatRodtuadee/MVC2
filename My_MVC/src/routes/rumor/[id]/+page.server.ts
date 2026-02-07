// src/routes/rumor/[id]/+page.server.ts
import { PrismaClient } from '@prisma/client';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

const prisma = new PrismaClient();

export const load: PageServerLoad = async ({ params }) => {
  const rumor = await prisma.rumor.findUnique({
    where: { id: params.id },
    include: { reports: { include: { user: true } } }
  });
  
  const users = await prisma.user.findMany(); 
  
  if (!rumor) throw new Error("Rumor not found");

  return { rumor, users };
};

export const actions: Actions = {
  report: async ({ request, params }) => {
    const formData = await request.formData();
    const userId = Number(formData.get('userId'));
    const type = String(formData.get('type') || '');
    const password = String(formData.get('password') || ''); // รับรหัสผ่านเพิ่ม

    // 1. ดึงข้อมูล User มาเช็ค Role และ Password
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (!user) {
        return fail(400, { message: 'ไม่พบผู้ใช้งาน' });
    }

    // ------------------------------------------------
    // 🛡️ กรณีเป็น AUDITOR (ทำการตรวจสอบข่าว)
    // ------------------------------------------------
    if (user.role === 'auditor') {
        // เช็ครหัสผ่าน (เทียบกับใน Database)
        if (user.password !== password) {
            return fail(400, { message: '❌ รหัสผ่านสำหรับ Auditor ไม่ถูกต้อง!' });
        }

        // อัปเดตข่าวเป็น "ตรวจสอบแล้ว" (Verified) และรีเซ็ตสถานะเป็น normal
        await prisma.rumor.update({
            where: { id: params.id },
            data: { 
                is_verified: true, 
                status: 'normal' 
            }
        });

        return { success: true, message: '✅ ยืนยันตรวจสอบข่าวเรียบร้อยแล้ว' };
    }

    // ------------------------------------------------
    // 👤 กรณีเป็น USER ทั่วไป (ทำการแจ้ง Report)
    // ------------------------------------------------
    try {
      // 1. บันทึก Report
      await prisma.report.create({
        data: {
          rumorId: params.id,
          userId: userId,
          type: type
        }
      });

      // 2. เช็คจำนวน Report ถ้าเกิน 3 ครั้ง -> เปลี่ยนเป็น PANIC
      // (เช็คเพิ่มว่าถ้าข่าวยังไม่ Verified ถึงจะเปลี่ยนเป็น Panic ได้)
      const count = await prisma.report.count({ where: { rumorId: params.id } });
      
      const currentRumor = await prisma.rumor.findUnique({ where: { id: params.id } });
      
      if (count >= 3 && !currentRumor?.is_verified) {
        await prisma.rumor.update({
          where: { id: params.id },
          data: { status: 'panic' }
        });
      }

      return { success: true, message: 'ส่งรายงานเรียบร้อยแล้ว' };

    } catch (error) {
      // User คนเดิมแจ้งซ้ำไม่ได้ (ติด Unique Constraint)
      return fail(400, { message: 'คุณได้รายงานข่าวนี้ไปแล้ว หรือเกิดข้อผิดพลาด' });
    }
  }
};