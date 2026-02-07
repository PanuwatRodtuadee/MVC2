// prisma/seed.js
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // 1. สร้าง User 10 คน + Auditor 1 คน
  const users = []
  for (let i = 1; i <= 11; i++) {
    const isAuditor = (i === 11);
    users.push({
        name: isAuditor ? 'Auditor (User 11)' : `User ${i}`,
        role: isAuditor ? 'auditor' : 'general',
        password: isAuditor ? 'admin123' : '1234'
    })
  }
  await prisma.user.createMany({ data: users })

  // 2. สร้าง Rumors 8 ข่าว
  const rumors = [
    { id: '01000001', title: 'น้ำมะนาวรักษาโรคมะเร็ง', content: 'มีข่าวลือว่ากินมะนาวโซดาหายทุกโรค', status: 'normal', credibility_score: 20 },
    { id: '01000002', title: 'พายุกำลังจะถล่มกรุงเทพ', content: 'ฝนจะตกหนักน้ำท่วมมิดตึก', status: 'panic', credibility_score: 40 },
    { id: '01000003', title: 'แจกเงินดิจิทัลเพิ่ม', content: 'รัฐจะแจกเพิ่มอีกคนละหมื่น', status: 'normal', credibility_score: 60 },
    { id: '01000004', title: 'เอเลี่ยนบุกโลก', content: 'พบจานบินที่เชียงใหม่', status: 'normal', credibility_score: 10 },
    { id: '01000005', title: 'หุ้นตัวนี้จะขึ้น 1000%', content: 'วงในบอกมา', status: 'normal', credibility_score: 50 },
    { id: '01000006', title: 'กินกล้วยตอนเช้าอันตราย', content: 'ห้ามกินกล้วยท้องว่าง', status: 'normal', credibility_score: 30 },
    { id: '01000007', title: 'น้ำประปาเค็ม', content: 'การประปาแจ้งเตือน', status: 'normal', credibility_score: 85 },
    { id: '01000008', title: 'ไวรัสตัวใหม่ระบาด', content: 'ระวังตัวกันด้วย', status: 'normal', credibility_score: 45 },
  ]
  
  for (const r of rumors) {
    await prisma.rumor.create({ data: r })
  }
  
  console.log('✅ Seed Data เรียบร้อย!')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })