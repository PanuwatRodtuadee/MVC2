<script>
    export let data;
    export let form;
  
<<<<<<< HEAD
    // 1. ตัวแปรเก็บ ID คนที่ถูกเลือก
    let selectedUserId = "";
  
    // 2. เช็คว่าคนนี้เป็น Auditor หรือไม่? (ถ้าใช่ isAuditor จะเป็น true)
    $: isAuditor = data.users.find(u => u.id == selectedUserId)?.role === 'auditor';
=======
    let selectedUserId = "";
  
    $: isAuditorSelected = data.users.find(u => u.id == selectedUserId)?.role === 'auditor';
>>>>>>> 5f708650907fd91cd7a35412458bc768eaaf21fb
  </script>
  
  <div class="container mt-5">
    <a href="/" class="btn btn-secondary mb-3">&larr; กลับหน้าหลัก</a>
  
    {#if form?.message}
      <div class="alert {form.success ? 'alert-success' : 'alert-danger'}">{form.message}</div>
    {/if}
  
    <div class="card mb-4 shadow">
      <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
        <h3>{data.rumor.title}</h3>
        
        {#if data.rumor.is_verified}
            <span class="badge bg-success fs-6">✅ ตรวจสอบแล้ว</span>
        {:else}
            <span class="badge {data.rumor.status === 'panic' ? 'bg-danger' : 'bg-warning text-dark'}">
              {data.rumor.status.toUpperCase()}
            </span>
        {/if}
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
                  <h4>⚙️ ดำเนินการเกี่ยวกับข่าว</h4>
                  
                  <form method="POST" action="?/report">
                      
                      <div class="mb-3">
                          <label class="form-label">เลือกผู้ดำเนินการ</label>
                          <select name="userId" class="form-select" bind:value={selectedUserId} required>
                              <option value="" disabled selected>-- กรุณาเลือก --</option>
                              {#each data.users as u}
                                  <option value={u.id}>{u.name} ({u.role})</option>
                              {/each}
                          </select>
                      </div>
  
                      {#if isAuditor}
                          <div class="alert alert-success border-success">
                              <h6>🛡️ โหมดผู้ตรวจสอบ</h6>
                              <div class="mb-3">
                                  <label class="form-label fw-bold">รหัสผ่านยืนยันตัวตน</label>
                                  <input type="password" name="password" class="form-control" placeholder="ใส่รหัสผ่าน..." required>
                              </div>
                              <button type="submit" class="btn btn-success w-100">✅ ยืนยันตรวจสอบ (Verify)</button>
                          </div>
                      {:else}
                          <div class="mb-3">
                              <label class="form-label">ประเภทความผิดปกติ</label>
                              <select name="type" class="form-select">
                                  <option>บิดเบือน</option>
                                  <option>ปลุกปั่น</option>
                                  <option>ข้อมูลเท็จ</option>
                              </select>
                          </div>
                          <button type="submit" class="btn btn-danger w-100">🚨 ส่งรายงาน</button>
                      {/if}
  
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