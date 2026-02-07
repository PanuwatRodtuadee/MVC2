// src/routes/create/+page.server.ts
import { PrismaClient } from '@prisma/client';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

const prisma = new PrismaClient();

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const title = String(data.get('title'));
    const content = String(data.get('content'));

    // สร้าง ID แบบสุ่ม (หรือจะรันเลขก็ได้)
    const randomId = '0' + Math.floor(1000000 + Math.random() * 9000000).toString();

    await prisma.rumor.create({
      data: {
        id: randomId,
        title,
        content,
        is_approved: false // ⭐ สำคัญ: สร้างใหม่ต้องเป็น false เสมอ
      }
    });

    // ส่งกลับหน้าแรก
    throw redirect(303, '/');
  }
};