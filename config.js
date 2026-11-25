// ตั้งค่าการเชื่อมต่อ Supabase (ใส่ค่าจาก Supabase Dashboard)
// - SUPABASE_URL      : Project URL เช่น https://abcdefgh.supabase.co
// - SUPABASE_ANON_KEY : Publishable key (sb_publishable_...) หรือ anon key แบบเดิม (eyJ...)
// ห้ามใส่ secret key / service_role key เด็ดขาด
// ถ้าปล่อยว่าง เว็บจะทำงานโหมดทดสอบ (เก็บข้อมูลในเครื่องของผู้ใช้เท่านั้น)
window.NSL_CONFIG = {
  SUPABASE_URL: 'https://echdjsbzniszvupyznmx.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_bCfg7PHtSY1v547OdGeyYQ_bqfGyFJS'
};

/* ประกาศปิดให้บริการ: ปิด popup ได้ แต่ยังแสดงกระทงเดิมแบบสุ่มวนต่อเนื่อง */
(() => {
  const addNoticeStyles = () => {
    if (document.getElementById('nsl-closure-style')) return;
    const style = document.createElement('style');
    style.id = 'nsl-closure-style';
    style.textContent = `
      #nsl-closure-notice {
        position: fixed; inset: 0; z-index: 2147483647;
        display: grid; place-items: center; padding: 20px;
        background: rgba(3, 13, 31, .82); backdrop-filter: blur(8px);
        color: #f4f9ff; font-family: 'Kanit', system-ui, sans-serif;
      }
      #nsl-closure-notice .nsl-notice-card {
        width: min(100%, 520px); max-height: min(90vh, 760px); overflow: auto;
        padding: clamp(22px, 6vw, 36px); border: 1px solid rgba(255,255,255,.25);
        border-radius: 24px; text-align: center;
        background: linear-gradient(145deg, rgba(13,54,93,.98), rgba(8,34,74,.98));
        box-shadow: 0 24px 80px rgba(0,0,0,.5);
      }
      #nsl-closure-notice h2 { margin: 0 0 18px; color: #ffd18c; font-size: clamp(21px, 5vw, 28px); line-height: 1.4; }
      #nsl-closure-notice p { margin: 12px 0; font-size: 16px; line-height: 1.75; }
      #nsl-closure-notice .nsl-status {
        margin: 20px 0; padding: 14px; border: 1px solid rgba(11,184,181,.55);
        border-radius: 16px; background: rgba(11,184,181,.12);
      }
      #nsl-closure-notice .nsl-status strong { display: block; margin-bottom: 6px; color: #9ff3f0; font-size: 18px; }
      #nsl-closure-notice .nsl-note { color: #ffdcae; font-size: 14px; }
      #nsl-closure-notice .nsl-close {
        margin-top: 12px; border: 0; border-radius: 999px; padding: 11px 28px;
        background: linear-gradient(90deg, #f47920, #ff9a4a); color: #fff;
        font: inherit; font-size: 16px; font-weight: 600; cursor: pointer;
      }
      #nsl-closure-notice .nsl-close:focus-visible { outline: 3px solid #9ff3f0; outline-offset: 3px; }
    `;
    document.head.appendChild(style);
  };

  const fetchKrathongs = async () => {
    const cfg = window.NSL_CONFIG || {};
    const key = cfg.SUPABASE_ANON_KEY || '';
    if (cfg.SUPABASE_URL && key) {
      try {
        const url = cfg.SUPABASE_URL.replace(/\\/$/, '') + '/rest/v1/krathongs?select=k,fl,f,n,w&order=id.asc&limit=2000';
        const response = await fetch(url, { headers: { apikey: key, Authorization: key.startsWith('eyJ') ? 'Bearer ' + key : undefined } });
        if (response.ok) return await response.json();
      } catch (error) { /* Fall back to the local saved entries. */ }
    }
    try {
      const saved = JSON.parse(localStorage.getItem('nsl_loy_v1') || '[]');
      if (Array.isArray(saved)) return saved.map((entry, index) => Array.isArray(entry)
        ? { k: 'ABCDE'[index % 5], fl: 'ABCDE'[index % 5], f: 'A', n: entry[0], w: entry[1] }
        : entry);
    } catch (error) { /* localStorage may be unavailable */ }
    return [];
  };

  const shuffle = values => {
    const result = values.slice();
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };

  const startClosedServiceDisplay = async () => {
    const scene = document.getElementById('scene');
    const wizard = document.getElementById('wiz');
    const field = document.getElementById('field');
    if (!scene || !field || typeof window.node !== 'function') return;

    // Prevent the closed service's creation controls from being used after dismissing the notice.
    if (wizard) wizard.style.display = 'none';
    scene.style.display = 'block';
    const bar = scene.querySelector('.bar');
    if (bar) bar.remove();
    if (typeof window.showScene === 'function') window.showScene = () => {};
    if (typeof window.home === 'function') window.home = () => {};

    const waves = field.querySelector('.waves');
    field.replaceChildren(...(waves ? [waves] : []));
    const records = (await fetchKrathongs()).filter(entry => entry && entry.k && entry.fl && entry.f && entry.n && entry.w);
    if (!records.length) return;

    const lanes = [68, 74, 80];
    let queue = shuffle(records);
    let cursor = 0;
    const launchNext = () => {
      if (!field.isConnected) return;
      if (cursor >= queue.length) { queue = shuffle(records); cursor = 0; }
      const entry = queue[cursor++];
      const lane = Math.floor(Math.random() * lanes.length);
      const width = ['clamp(70px,10vw,115px)', 'clamp(85px,13vw,150px)', 'clamp(100px,16vw,190px)'][lane];
      const raft = window.node(entry, width);
      raft.style.top = lanes[lane] + '%';
      raft.style.animationDuration = (55 + Math.random() * 45) + 's';
      raft.style.animationDelay = '0s';
      field.appendChild(raft);
      raft.addEventListener('animationend', () => raft.remove(), { once: true });
      // Safety cleanup in browsers that do not dispatch animationend for detached/hidden elements.
      window.setTimeout(() => raft.remove(), 110000);
    };
    launchNext();
    window.setInterval(launchNext, 2600);
  };

  const showClosureNotice = () => {
    if (document.getElementById('nsl-closure-notice')) return;
    addNoticeStyles();

    const overlay = document.createElement('div');
    overlay.id = 'nsl-closure-notice';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'nsl-closure-title');
    overlay.innerHTML = `
      <section class="nsl-notice-card" tabindex="-1">
        <h2 id="nsl-closure-title">📢 ประกาศปิดให้บริการลอยกระทงออนไลน์</h2>
        <p>ขอขอบคุณพนักงานทุกท่านที่ร่วมสืบสานประเพณีไทยแบบรักษ์โลกไปด้วยกันนะคะ 🪷</p>
        <div class="nsl-status">
          <strong>สถานะคำอธิษฐาน: กำลังดำเนินการ (In Progress)</strong>
          <p>ขณะนี้สิ่งศักดิ์สิทธิ์กำลังทยอยอนุมัติคำขอของท่านตามลำดับคิว กรุณารอรับความปังโดยไม่แซงคิวกันนะคะ</p>
        </div>
        <p class="nsl-note">หมายเหตุ: ระยะเวลาการสมหวังขึ้นอยู่กับแต้มบุญของแต่ละบุคคล 🙏✨</p>
        <button class="nsl-close" type="button">ปิดประกาศ</button>
      </section>
    `;
    document.body.appendChild(overlay);

    for (const child of document.body.children) {
      if (child !== overlay) child.inert = true;
    }
    const closeNotice = () => {
      overlay.remove();
      for (const child of document.body.children) child.inert = false;
      startClosedServiceDisplay();
    };
    overlay.querySelector('.nsl-close').addEventListener('click', closeNotice);
    overlay.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeNotice();
    });
    overlay.querySelector('.nsl-close').focus();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showClosureNotice, { once: true });
  } else {
    showClosureNotice();
  }
})();
