<script>
    export let data;
    export let form; // รับค่า error จาก Server
  
    // 1. สร้างตัวแปรเก็บ ID ของ User ที่ถูกเลือกใน Dropdown
    let selectedUserId = "";
  
    // 2. สร้าง Reactive Statement: คอยเช็คตลอดเวลาว่า User ที่เลือกมี role เป็น 'auditor' หรือไม่?
    $: isAuditorSelected = data.users.find(u => u.id == selectedUserId)?.role === 'auditor';
  </script>
  
  <div class="container mt-5">
    <a href="/" class="btn btn-secondary mb-3">&larr; กลับหน้าหลัก</a>
  
    {#if form?.message}
      <div class="alert alert-danger">{form.message}</div>
    {/if}
  
    <div class="card mb-4 shadow">
      <div class="card-header bg-dark text-white d-flex justify-content-between">
        <h3>{data.rumor.title}</h3>
        <span class="badge {data.rumor.status === 'panic' ? 'bg-danger' : 'bg-success'}">
          {data.rumor.status.toUpperCase()}
        </span>
      </div>
      <div class="card-body">
          <p class="lead">{data.rumor.content}</p>
          <p><strong>ความน่าเชื่อถือ:</strong> {data.rumor.credibility_score}%</p>
      </div>
    </div>
  
    <div class="row">
      <div class="col-md-6">
          <div class="card bg-light">
              <div class="card-body">
                  <h4>🚨 แจ้งข่าวปลอม/บิดเบือน</h4>
                  <form method="POST" action="?/report">
                      
                      <div class="mb-3">
                          <label class="form-label">เลือกชื่อของคุณ (จำลอง Login)</label>
                          <select name="userId" class="form-select" bind:value={selectedUserId} required>
                              <option value="" disabled selected>-- กรุณาเลือก --</option>
                              {#each data.users as u}
                                  <option value={u.id}>{u.name} ({u.role})</option>
                              {/each}
                          </select>
                      </div>
  
                      {#if isAuditorSelected}
                          <div class="mb-3 bg-white p-3 border rounded shadow-sm">
                              <label class="form-label text-danger fw-bold">🔑 รหัสผ่าน (สำหรับ Auditor)</label>
                              <input type="password" name="password" class="form-control" placeholder="กรอกรหัสผ่าน..." required>
                              <div class="form-text text-muted">รหัสผ่านทดสอบ: <strong>1234</strong></div>
                          </div>
                      {/if}
  
                      <div class="mb-3">
                          <label class="form-label">ประเภทความผิดปกติ</label>
                          <select name="type" class="form-select">
                              <option>บิดเบือน</option>
                              <option>ปลุกปั่น</option>
                              <option>ข้อมูลเท็จ</option>
                          </select>
                      </div>
                      
                      <button type="submit" class="btn btn-danger w-100">ส่งรายงาน</button>
                  </form>
              </div>
          </div>
      </div>
  
      <div class="col-md-6">
          <h4>ประวัติการรายงาน ({data.rumor.reports.length})</h4>
          <ul class="list-group">
              {#each data.rumor.reports as r}
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                      <span>
                          <strong>{r.user.name}</strong> แจ้งว่า: {r.type}
                      </span>
                      <small class="text-muted">{new Date(r.report_date).toLocaleTimeString()}</small>
                  </li>
              {/each}
          </ul>
      </div>
    </div>
  </div>