<script>
    export let data;
  </script>
  
  <div class="container mt-5">
      <h1>📊 Dashboard สรุปสถานการณ์</h1>
      <a href="/" class="btn btn-outline-secondary mb-4">กลับหน้าหลัก</a>
  
      <div class="row">
          <div class="col-md-6">
              <div class="card border-danger mb-3">
                  <div class="card-header bg-danger text-white">🔥 ข่าวสถานะ PANIC</div>
                  <div class="card-body">
                      {#if data.panics.length === 0}
                          <p class="text-muted">ยังไม่มีข่าว Panic</p>
                      {:else}
                          <ul class="list-group">
                              {#each data.panics as p}
                                  <li class="list-group-item">{p.title} (ID: {p.id})</li>
                              {/each}
                          </ul>
                      {/if}
                  </div>
              </div>
          </div>
  
          <div class="col-md-6">
              <div class="card border-success mb-3">
                  <div class="card-header bg-success text-white">✅ ข่าวที่ตรวจสอบแล้ว (Verified)</div>
                  <div class="card-body">
                       <ul class="list-group">
                          {#each data.verified as v}
                              <li class="list-group-item d-flex justify-content-between">
                                  <span>{v.title}</span>
                                  <span class="badge bg-secondary">Score: {v.credibility_score}</span>
                              </li>
                          {/each}
                      </ul>
                  </div>
              </div>
          </div>
      </div>
  </div>