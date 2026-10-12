const $ = (s) => document.querySelector(s);

// Tema terang/gelap (diingat lewat localStorage)
const themeToggle = $("#themeToggle");
function setTheme(dark) {
  document.body.classList.toggle("dark-theme", dark);
  $("#themeIcon").textContent = dark ? "☀" : "☾";
  themeToggle.setAttribute("aria-label", dark ? "Aktifkan mode terang" : "Aktifkan mode gelap");
}
let dark = false;
try { dark = localStorage.getItem("tema") === "gelap"; } catch (e) {}
setTheme(dark);
themeToggle.addEventListener("click", () => {
  dark = !dark;
  setTheme(dark);
  try { localStorage.setItem("tema", dark ? "gelap" : "terang"); } catch (e) {}
});

// Menu mobile (otomatis menutup setelah link diklik)
const menuToggle = $("#menuToggle");
const navLinks = $("#navLinks");
function setMenu(open) {
  navLinks.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Tutup menu navigasi" : "Buka menu navigasi");
}
menuToggle.addEventListener("click", () => setMenu(!navLinks.classList.contains("open")));
const tautan = [...navLinks.querySelectorAll("a")];
tautan.forEach((a) => a.addEventListener("click", () => setMenu(false)));

// Tandai menu aktif sesuai bagian yang sedang dilihat
const bagian = ["#main .hero", "#project", "#kontak"].map($);
function tandaiMenu() {
  const y = window.scrollY + 140;
  const aktif = bagian.findLastIndex((el) => el.offsetTop <= y);
  tautan.forEach((a, i) => i === Math.max(aktif, 0) ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"));
}
window.addEventListener("scroll", tandaiMenu, { passive: true });
tandaiMenu();

// Tombol kembali ke atas
const toTop = $("#toTop");
window.addEventListener("scroll", () => toTop.classList.toggle("visible", window.scrollY > 450), { passive: true });
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
$("#year").textContent = new Date().getFullYear();

// Modal bersama (detail project dan konfirmasi form)
const modal = $("#modal");
function bukaModal(eyebrow, judul, isi, repo, live) {
  $("#modalEyebrow").textContent = eyebrow;
  $("#modalTitle").textContent = judul;
  $("#modalBody").textContent = isi;
  $("#modalLive").hidden = !live;
  if (live) $("#modalLive").href = live;
  $("#modalLink").hidden = !repo;
  if (repo) $("#modalLink").href = "https://github.com/jnznomercy/" + repo;
  modal.showModal();
}
$("#modalClose").addEventListener("click", () => modal.close());
document.querySelectorAll(".detail").forEach((btn) => {
  btn.addEventListener("click", () =>
    bukaModal("DETAIL PROJECT", btn.dataset.judul, btn.dataset.detail, btn.dataset.repo, btn.dataset.live));
});

// Validasi form kontak
const form = $("#contactForm");
const setError = (id, pesan) => {
  $("#" + id + "Error").textContent = pesan;
  $("#" + id).setAttribute("aria-invalid", pesan ? "true" : "false");
  return !pesan;
};
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const hasil = [
    setError("name", $("#name").value.trim().length >= 3 ? "" : "Nama minimal 3 karakter."),
    setError("email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($("#email").value.trim()) ? "" : "Masukkan alamat email yang valid."),
    setError("message", $("#message").value.trim().length >= 10 ? "" : "Pesan minimal 10 karakter."),
  ];
  if (hasil.includes(false)) return form.querySelector('[aria-invalid="true"]').focus();
  bukaModal("PESAN TERKIRIM", "Terima kasih!", `Halo ${$("#name").value.trim()}, pesanmu sudah divalidasi. Ini demo, belum dikirim ke server.`);
  form.reset();
  ["name", "email", "message"].forEach((id) => $("#" + id).removeAttribute("aria-invalid"));
});