# ลอยกระทงออนไลน์ NSL Foods (GitHub Pages + Supabase)

ไฟล์ในชุดนี้
- `index.html` หน้าเว็บทั้งหมด (ภาพกระทง โลโก้ และพื้นหลังฝังอยู่ในไฟล์แล้ว)
- `config.js` ใส่ค่าเชื่อมต่อ Supabase
- `supabase/schema.sql` สร้างตารางและตั้งความปลอดภัย
- `.nojekyll` ให้ GitHub Pages ส่งไฟล์ตรง ๆ

## 1) สร้างฐานข้อมูลบน Supabase
1. สมัคร/เข้า supabase.com แล้วกด **New project** (เลือก region ใกล้ไทย เช่น Singapore) จดรหัสผ่านฐานข้อมูลไว้
2. เมื่อโปรเจกต์พร้อม ไปที่ **SQL Editor** > New query
3. เปิดไฟล์ `supabase/schema.sql` คัดลอกทั้งหมดไปวาง แล้วกด **Run**
4. ตรวจที่ **Table Editor** จะเห็นตาราง `krathongs`

## 2) นำค่าเชื่อมต่อมาใส่ `config.js`
- ปุ่ม **Connect** ด้านบนของโปรเจกต์ หรือ **Settings > API Keys** จะมี
  - **Project URL** (`https://xxxx.supabase.co`)
  - **Publishable key** (`sb_publishable_...`) ถ้าโปรเจกต์เก่ายังไม่มี ใช้ **anon key** เดิมได้
- ใส่ลงในไฟล์ `config.js`
- Publishable/anon key ออกแบบมาให้เปิดเผยในหน้าเว็บได้ **แต่ห้ามใส่ secret key หรือ service_role key เด็ดขาด**

## 3) อัปโหลดขึ้น GitHub
1. สร้าง repository ใหม่บน GitHub (เช่น `loy-krathong`)
2. กด **Add file > Upload files** ลากไฟล์ `index.html`, `config.js`, `.nojekyll` (และโฟลเดอร์ `supabase`) ขึ้นไป แล้ว Commit
3. ไปที่ **Settings > Pages** > Source: **Deploy from a branch** > Branch: `main` / `(root)` > Save
4. รอ 1-2 นาที จะได้ลิงก์ `https://<ชื่อผู้ใช้>.github.io/<ชื่อ repo>/`

## 4) ทดสอบก่อนใช้งานจริง
- เปิดลิงก์ ลอยกระทง 1 ใบ แล้วดูในตาราง `krathongs` ว่ามีข้อมูลเข้า
- เปิดจากอีกเครื่อง/อีกเบราว์เซอร์ ควรเห็นกระทงของใบแรก
- ก่อนเปิดจริงล้างข้อมูลทดสอบด้วย `truncate public.krathongs restart identity;` ใน SQL Editor

## ข้อควรรู้
- **ใครมีลิงก์ก็เข้าได้**: GitHub Pages (ฟรี) เป็นเว็บสาธารณะ ข้อมูลชื่อและคำอธิษฐานอ่านได้โดยทุกคนที่มีลิงก์และคีย์ ถ้าต้องจำกัดเฉพาะพนักงาน ต้องเพิ่มระบบรหัสผ่าน/ล็อกอิน (บอกผมได้)
- **ลบข้อความไม่เหมาะสม**: ที่ Table Editor ลบแถวนั้นได้ (หน้าเว็บแก้ไข/ลบเองไม่ได้)
- **จำกัด 2000 ชุด**: ตั้งไว้ใน trigger ของ `schema.sql` (เมื่อเต็มจะขึ้นข้อความว่าครบแล้ว)
- **Supabase แผนฟรีจะ pause โปรเจกต์** ถ้าไม่มีการใช้งานนาน 7 วัน ให้เปิดหน้าเว็บทดสอบก่อนวันงานและตรวจว่าโปรเจกต์ยัง Active
- ภาษา: ไทย/พม่า/เขมร/ลาว สลับได้ที่ปุ่มด้านบนสุด (ศัพท์พม่าและเขมรควรให้เจ้าของภาษาตรวจ)
