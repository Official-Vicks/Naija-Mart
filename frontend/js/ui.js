// UI helpers: toast, modal, format, navbar, mobile menu
const UI = {
  formatNaira(n) {
    const num = Number(n || 0);
    return "₦" + num.toLocaleString("en-NG", { maximumFractionDigits: 0 });
  },
  toast(message, type = "info", timeout = 3200) {
    let host = document.querySelector(".toast");
    if (!host) {
      host = document.createElement("div");
      host.className = "toast";
      document.body.appendChild(host);
    }
    const el = document.createElement("div");
    el.className = `item ${type}`;
    el.textContent = message;
    host.appendChild(el);
    setTimeout(() => {
      el.style.opacity = "0";
      el.style.transform = "translateY(8px)";
      el.style.transition = "all .25s";
    }, timeout - 250);
    setTimeout(() => el.remove(), timeout);
  },
  confirm(message) {
    return new Promise((resolve) => {
      const back = document.createElement("div");
      back.className = "modal-back";
      back.innerHTML = `
        <div class="modal p-6 max-w-sm">
          <h3 class="font-display text-lg font-semibold mb-2">Are you sure?</h3>
          <p class="text-slate-600 text-sm mb-5">${message}</p>
          <div class="flex justify-end gap-2">
            <button class="btn-ghost" data-act="no">Cancel</button>
            <button class="btn-primary" data-act="yes" style="background:#dc2626; box-shadow:none;">Confirm</button>
          </div>
        </div>`;
      back.addEventListener("click", (e) => {
        if (e.target === back || e.target.dataset.act === "no") {
          back.remove();
          resolve(false);
        }
        if (e.target.dataset.act === "yes") {
          back.remove();
          resolve(true);
        }
      });
      document.body.appendChild(back);
    });
  },
  openModal(html) {
    const back = document.createElement("div");
    back.className = "modal-back";
    back.innerHTML = `<div class="modal">${html}</div>`;
    back.addEventListener("click", (e) => {
      if (e.target === back) back.remove();
    });
    document.body.appendChild(back);
    return back;
  },
  navbar(active = "") {
    const user = API.getUser();
    const authLinks = user
      ? `<a href="dashboard.html" class="btn-primary">Dashboard</a>`
      : `<a href="login.html" class="btn-ghost">Sign in</a>
         <a href="register.html" class="btn-primary">Start selling</a>`;
    return `
    <header class="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a href="index.html" class="flex items-center gap-2">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold">N</div>
          <span class="font-display text-lg font-bold">Naijamart</span>
        </a>
        <nav class="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <a href="index.html" class="${
            active === "home" ? "text-emerald-700" : ""
          } hover:text-emerald-700">Home</a>
          <a href="product.html" class="${
            active === "shop" ? "text-emerald-700" : ""
          } hover:text-emerald-700">Shop</a>
          <a href="index.html#sellers" class="hover:text-emerald-700">For Sellers</a>
          <a href="index.html#testimonials" class="hover:text-emerald-700">Testimonials</a>
        </nav>
        <div class="hidden md:flex items-center gap-2">${authLinks}</div>
        <button id="navToggle" class="md:hidden p-2 rounded-lg hover:bg-slate-100" aria-label="Menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
        </button>
      </div>
      <div id="navMobile" class="hidden md:hidden border-t border-slate-100 bg-white">
        <div class="px-4 py-3 flex flex-col gap-2 text-sm">
          <a href="index.html" class="py-2">Home</a>
          <a href="product.html" class="py-2">Shop</a>
          <a href="index.html#sellers" class="py-2">For Sellers</a>
          <div class="flex gap-2 pt-2">${authLinks}</div>
        </div>
      </div>
    </header>`;
  },
  mountNavbar(active) {
    const slot = document.getElementById("navbar");
    if (!slot) return;
    slot.innerHTML = UI.navbar(active);
    const tog = document.getElementById("navToggle");
    const mob = document.getElementById("navMobile");
    if (tog && mob)
      tog.addEventListener("click", () => mob.classList.toggle("hidden"));
  },
  footer() {
    return `
    <footer class="mt-24 border-t border-slate-100 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid md:grid-cols-4 gap-8">
        <div>
          <div class="flex items-center gap-2 mb-3">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center font-bold">N</div>
            <span class="font-display font-bold">Naijamart</span>
          </div>
          <p class="text-sm text-slate-500">Nigeria's modern marketplace for ambitious sellers.</p>
        </div>
        <div>
          <h4 class="font-semibold mb-3 text-sm">Product</h4>
          <ul class="space-y-2 text-sm text-slate-600">
            <li><a href="product.html" class="hover:text-emerald-700">Browse shop</a></li>
            <li><a href="register.html" class="hover:text-emerald-700">Become a seller</a></li>
            <li><a href="dashboard.html" class="hover:text-emerald-700">Dashboard</a></li>
          </ul>
        </div>
        <div>
        <h4 class="font-semibold mb-3 text-sm">Company</h4>
        <ul class="space-y-2 text-sm text-slate-600">
          <li><a href="about.html" class="hover:text-emerald-700">About</a></li>
          <li><a href="careers.html" class="hover:text-emerald-700">Careers</a></li>
          <li><a href="contact.html" class="hover:text-emerald-700">Contact</a></li>
        </ul>
      </div>
      <div>
        <h4 class="font-semibold mb-3 text-sm">Legal</h4>
        <ul class="space-y-2 text-sm text-slate-600">
          <li><a href="privacy.html" class="hover:text-emerald-700">Privacy</a></li>
          <li><a href="terms.html" class="hover:text-emerald-700">Terms</a></li>
        </ul>
      </div>
    </div>
    <div class="border-t border-slate-100 py-5 text-center text-xs text-slate-500">© ${new Date().getFullYear()} Naijamart. Built for Nigerian commerce.</div>
  </footer>`;
  },
  whatsappUrl(phone, productName) {
    const clean = String(phone || "2348000000000").replace(/[^0-9]/g, "");
    const msg = encodeURIComponent(
      `Hi! I'm interested in "${productName}" on Naijamart. Is it still available?`
    );
    return `https://wa.me/${clean}?text=${msg}`;
  },
};
window.UI = UI;
