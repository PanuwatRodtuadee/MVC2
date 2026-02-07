<script>
  export let data;
</script>

<div class="container mt-5">
  <div class="d-flex justify-content-between align-items-center mb-4">
    <h1>📢 ระบบติดตามข่าวลือ</h1>
    <a href="/dashboard" class="btn btn-warning">ไปหน้า Dashboard</a>
  </div>

  <table class="table table-hover table-bordered shadow-sm">
    <thead class="table-dark">
      <tr>
        <th>รหัสข่าว</th>
        <th>หัวข้อข่าว</th>
        <th>สถานะ</th>
        <th>ความน่าเชื่อถือ</th>
        <th>จำนวนคนแจ้ง</th>
        <th>จัดการ</th>
      </tr>
    </thead>
    <tbody>
      {#each data.rumors as r}
        <tr class="{r.is_verified ? 'table-success' : (r.status === 'panic' ? 'table-danger' : '')}">
          <td>{r.id}</td>
          <td>{r.title}</td>
          <td>
            {#if r.is_verified}
              <span class="badge bg-success">✅ ตรวจสอบแล้ว</span>
            {:else}
              <span class="badge {r.status === 'panic' ? 'bg-danger' : 'bg-secondary'}">
                {r.status}
              </span>
            {/if}
          </td>
          <td>{r.credibility_score}%</td>
          <td>{r._count.reports} ครั้ง</td>
          <td>
            <a href="/rumor/{r.id}" class="btn btn-sm btn-primary">ดูรายละเอียด</a>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>