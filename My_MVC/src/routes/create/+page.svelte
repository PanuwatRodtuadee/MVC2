<div class="container mt-5">
    <h1>เขียนข่าวใหม่</h1>
    <form method="POST" class="card p-4">
      <div class="mb-3">
        <label class="form-label">หัวข้อข่าว</label>
        <input type="text" name="title" class="form-control" required placeholder="เช่น น้ำท่วมโลก...">
      </div>
      <div class="mb-3">
        <label class="form-label">เนื้อหาข่าว</label>
        <textarea name="content" class="form-control" rows="3" required></textarea>
      </div>
      <button type="submit" class="btn btn-primary">ส่งข่าวให้ตรวจสอบ</button>
    </form>
  </div>