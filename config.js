// ตั้งค่าการเชื่อมต่อ Supabase (ใส่ค่าจาก Supabase Dashboard)
// - SUPABASE_URL      : Project URL เช่น https://abcdefgh.supabase.co
// - SUPABASE_ANON_KEY : Publishable key (sb_publishable_...) หรือ anon key แบบเดิม (eyJ...)
// ห้ามใส่ secret key / service_role key เด็ดขาด
// ถ้าปล่อยว่าง เว็บจะทำงานโหมดทดสอบ (เก็บข้อมูลในเครื่องของผู้ใช้เท่านั้น)
window.NSL_CONFIG = {
  SUPABASE_URL: '',
  SUPABASE_ANON_KEY: ''
};
