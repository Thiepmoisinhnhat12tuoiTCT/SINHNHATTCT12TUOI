/* ====== CHỈNH THÔNG TIN SỰ KIỆN Ở ĐÂY ====== */
const CONFIG = {
  clubName: "CLB Thanh niên Tình nguyện Marketing - TCT",
  age: "12",                               // sinh nhật lần thứ mấy
  eventStart: "2026-11-28T17:30:00+07:00", // giờ bắt đầu (đếm ngược + lịch)
  eventEnd:   "2026-11-28T21:00:00+07:00", // giờ kết thúc dự kiến (chỉnh lại nếu khác)
  time: "17:30",
  venue: "Trung tâm Tổ chức Sự kiện VENUS - KIM EVENT",
  address: "39 Cầu Diễn, Xuân Phương, Hà Nội",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=VENUS+KIM+EVENT+39+Cau+Dien+Xuan+Phuong+Ha+Noi",
  contactName: "Ms. Kim Thu",
  contactPhone: "0339310204",
  hosts: [],     // tuỳ chọn. Ví dụ: [{ name: "Họ và tên", role: "Chủ nhiệm", photo: "assets/a.jpg" }]
  program: [],   // tuỳ chọn. Ví dụ: [{ time: "17:30", title: "Đón khách" }]
  album: [],     // tuỳ chọn. Ví dụ: ["assets/1.jpg", "assets/2.jpg"]
  thanks: "CLB chân thành cảm ơn bạn đã dành thời gian đến chung vui. Sự hiện diện của bạn là món quà ý nghĩa nhất trong hành trình 12 năm của chúng mình.",
  /* Mã QR chuyển tiền: bỏ ảnh QR vào assets/qr.png (hoặc đổi đường dẫn) */
  qrImage: "assets/qr.png",
  qrInfo: "Tên chủ tài khoản – Ngân hàng – Số tài khoản",
  /* Nhận RSVP: dán link Formspree / Google Apps Script (POST JSON). Để trống thì mở email tới rsvpEmail. */
  rsvpEndpoint: "",
  rsvpEmail: "clb@example.com"
};
/* ============================================= */

const $ = s => document.querySelector(s);
const d = new Date(CONFIG.eventStart);
const fmt = (o) => d.toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", ...o });
const derived = {
  dateShort: fmt({ day: "2-digit", month: "2-digit", year: "numeric" }).replaceAll("/", "."),
  dateLong: fmt({ weekday: "long", day: "numeric", month: "long", year: "numeric" })
};
const data = { ...CONFIG, ...derived };
document.querySelectorAll("[data-bind]").forEach(el => el.textContent = data[el.dataset.bind] ?? "");

// Tên khách từ URL: ?ten=Em%20Thương
const guest = new URLSearchParams(location.search).get("ten");
if (guest) { $("#guestName").textContent = guest; $("#rsvpName").value = guest; }

// Ban tổ chức (ẩn nếu để trống)
$("#hostsSection").hidden = !CONFIG.hosts.length;
$("#hostGrid").innerHTML = CONFIG.hosts.map(h => `
  <div class="host">${h.photo ? `<img src="${h.photo}" alt="${h.name}">` : `<div class="ph"></div>`}
  <b>${h.name}</b><span>${h.role}</span></div>`).join("");

// Chương trình (ẩn nếu để trống)
$("#programSection").hidden = !CONFIG.program.length;
$("#timeline").innerHTML = CONFIG.program.map(p => `<li><b>${p.time}</b> ${p.title}</li>`).join("");

// Album (ẩn nếu để trống)
$("#albumSection").hidden = !CONFIG.album.length;
$("#strip").innerHTML = CONFIG.album.map((src, i) =>
  `<figure><img src="${src}" alt="Ảnh ${i + 1}" loading="lazy"></figure>`).join("");
const strip = $("#strip"), figs = [...strip.children];
const updateCount = () => {
  if (!figs.length) return;
  const mid = strip.scrollLeft + strip.clientWidth / 2;
  const i = figs.findIndex(f => f.offsetLeft + f.offsetWidth > mid);
  $("#stripCount").textContent = `${Math.max(i, 0) + 1} / ${figs.length}`;
};
strip.addEventListener("scroll", updateCount, { passive: true }); updateCount();

// Liên hệ
$("#phoneLink").textContent = CONFIG.contactPhone.replace(/(\d{4})(\d{3})(\d{3})/, "$1.$2.$3");
$("#phoneLink").href = "tel:" + CONFIG.contactPhone;

// QR chuyển tiền
$("#qrImg").src = CONFIG.qrImage;
$("#qrInfo").textContent = CONFIG.qrInfo;
$("#qrBtn").onclick = e => {
  const box = $("#qrBox"), open = box.hidden;
  box.hidden = !open;
  e.currentTarget.setAttribute("aria-expanded", open);
  e.currentTarget.textContent = open ? "Ẩn mã QR" : "Hiện mã QR chuyển tiền";
};

// Bản đồ + lịch
$("#mapBtn").href = CONFIG.mapUrl;
const ics = t => new Date(t).toISOString().replace(/[-:]|\.\d{3}/g, "");
$("#calBtn").href = "data:text/calendar;charset=utf-8," + encodeURIComponent(
`BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${ics(CONFIG.eventStart)}\nDTEND:${ics(CONFIG.eventEnd)}\nSUMMARY:Sinh nhật lần thứ ${CONFIG.age} - ${CONFIG.clubName}\nLOCATION:${CONFIG.venue}, ${CONFIG.address}\nEND:VEVENT\nEND:VCALENDAR`);
$("#calBtn").download = "sinh-nhat-clb.ics";

// Đếm ngược
function tick() {
  const ms = d - Date.now();
  const el = $("#countdown");
  if (ms <= 0) { el.textContent = "Sự kiện đã diễn ra"; return; }
  const day = Math.floor(ms / 864e5), h = Math.floor(ms % 864e5 / 36e5), m = Math.floor(ms % 36e5 / 6e4);
  el.textContent = `Còn ${day} ngày ${h} giờ ${m} phút`;
}
tick(); setInterval(tick, 30000);

// RSVP
let count = 1;
const setCount = n => { count = Math.min(10, Math.max(1, n)); $("#count").textContent = count; };
$("#minus").onclick = () => setCount(count - 1);
$("#plus").onclick = () => setCount(count + 1);
document.querySelectorAll("[name=attend]").forEach(r => r.addEventListener("change", () => {
  $("#countField").hidden = r.value === "Không" && r.checked;
}));

$("#rsvpForm").addEventListener("submit", async e => {
  e.preventDefault();
  const f = e.target, msg = $("#formMsg");
  const name = f.name.value.trim(), attend = f.attend.value;
  msg.className = "form-msg";
  if (!name || !attend) { msg.textContent = "Bạn nhập tên và chọn có tham dự hay không nhé."; msg.classList.add("err"); return; }
  const payload = { name, attend, people: attend === "Có" ? count : 0, note: f.note.value.trim() };
  if (!CONFIG.rsvpEndpoint) {
    const body = `Tên: ${payload.name}\nTham dự: ${payload.attend}\nSố người: ${payload.people}\nLời nhắn: ${payload.note}`;
    location.href = `mailto:${CONFIG.rsvpEmail}?subject=${encodeURIComponent("RSVP sinh nhật CLB - " + name)}&body=${encodeURIComponent(body)}`;
    return;
  }
  try {
    msg.textContent = "Đang gửi…";
    const r = await fetch(CONFIG.rsvpEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(payload) });
    if (!r.ok) throw 0;
    msg.textContent = "Đã gửi xác nhận. Hẹn gặp bạn!"; f.reset(); setCount(1);
  } catch { msg.textContent = "Chưa gửi được. Bạn thử lại sau ít phút nhé."; msg.classList.add("err"); }
});
