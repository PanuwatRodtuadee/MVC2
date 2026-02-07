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
    const type = String(formData.get('type'));
    const password = String(formData.get('password') || '');

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
        return fail(400, { message: 'ไม่พบผู้ใช้งาน' });
    }

    if (user.role === 'auditor') {
        if (password !== user.password) {
            return fail(400, { message: '❌ รหัสผ่านสำหรับ Auditor ไม่ถูกต้อง!' });
        }
    }

    try {
      await prisma.report.create({
        data: { rumorId: params.id, userId: userId, type: type }
      });

      return { success: true };
    } catch (error) {
      return fail(400, { message: 'เกิดข้อผิดพลาด' });
    }
  }
};