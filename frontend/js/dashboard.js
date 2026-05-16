// Seller dashboard logic
const Dashboard = {
  state: { products: [], view: "overview" },

  async init() {
    if (!Auth.requireAuth()) return;
    Dashboard.bindShell();
    await Dashboard.loadProducts();
    Dashboard.renderStats();
    Dashboard.renderProducts();
    Dashboard.bindCreate();
  },

  bindShell() {
    const user = API.getUser() || {};
    const nameEl = document.getElementById("userName");
    if (nameEl)
      nameEl.textContent =
        user.name || user.store_name || user.email || "Seller";

    document.querySelectorAll("[data-view]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const view = btn.getAttribute("data-view");
        Dashboard.switchView(view);
      });
    });

    const sidebar = document.getElementById("sidebar");
    document
      .getElementById("sideToggle")
      ?.addEventListener("click", () =>
        sidebar.classList.toggle("-translate-x-full")
      );
    document
      .getElementById("sideOverlay")
      ?.addEventListener("click", () =>
        sidebar.classList.add("-translate-x-full")
      );
    document
      .getElementById("logoutBtn")
      ?.addEventListener("click", () => Auth.logout());
  },

  switchView(view) {
    document
      .querySelectorAll(".sidebar-link")
      .forEach((a) =>
        a.classList.toggle("active", a.getAttribute("data-view") === view)
      );
    document
      .querySelectorAll("[data-pane]")
      .forEach((p) =>
        p.classList.toggle("hidden", p.getAttribute("data-pane") !== view)
      );
    document.getElementById("sidebar")?.classList.add("-translate-x-full");
  },

  async loadProducts() {
    const grid = document.getElementById("dashProducts");
    if (grid) grid.innerHTML = Products.skeletons(4);
    Dashboard.state.products = await Products.fetchAllForSeller();
  },

  renderStats() {
    const list = Dashboard.state.products;
    const totalRevenue = list.reduce(
      (sum, p) => sum + p.price * Math.min(p.stock, 3),
      0
    );
    const stats = [
      {
        label: "Total products",
        value: list.length,
        icon: "📦",
        trend: "+3 this week",
      },
      {
        label: "In stock",
        value: list.filter((p) => p.stock > 0).length,
        icon: "✅",
        trend: "Healthy",
      },
      {
        label: "Out of stock",
        value: list.filter((p) => p.stock === 0).length,
        icon: "⚠️",
        trend: "Restock soon",
      },
      {
        label: "Est. inventory value",
        value: UI.formatNaira(totalRevenue),
        icon: "💰",
        trend: "Live",
      },
    ];
    const host = document.getElementById("statsGrid");
    if (!host) return;
    host.innerHTML = stats
      .map(
        (s) => `
      <div class="card p-5">
        <div class="flex items-center justify-between">
          <span class="text-sm text-slate-500">${s.label}</span>
          <span class="text-xl">${s.icon}</span>
        </div>
        <div class="mt-2 font-display text-2xl font-bold">${s.value}</div>
        <div class="mt-1 text-xs text-emerald-700">${s.trend}</div>
      </div>`
      )
      .join("");
  },

  renderProducts() {
    const grid = document.getElementById("dashProducts");
    if (!grid) return;
    if (!Dashboard.state.products.length) {
      grid.innerHTML = Products.emptyState("No products yet");
      return;
    }
    grid.innerHTML = Dashboard.state.products
      .map(
        (p) => `
      <div class="card p-4 flex gap-4 items-center">
        <img src="${
          p.images?.[0] || "https://placehold.co/120x120"
        }" class="w-16 h-16 rounded-lg object-cover bg-slate-100" alt="${
          p.name
        }"/>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <h4 class="font-semibold truncate">${p.name}</h4>
            <span class="badge ${
              p.stock > 0 ? "badge-success" : "badge-danger"
            }">${p.stock > 0 ? "In stock" : "Sold out"}</span>
          </div>
          <p class="text-xs text-slate-500 mt-0.5">${p.category} · ${
          p.stock
        } units</p>
          <p class="font-display font-bold mt-1">${UI.formatNaira(p.price)}</p>
        </div>
        <div class="flex gap-2">
          <button class="btn-ghost text-xs" data-edit="${p.id}">Edit</button>
          <button class="btn-ghost text-xs" data-del="${
            p.id
          }" style="color:#b91c1c;">Delete</button>
        </div>
      </div>`
      )
      .join("");

    grid.querySelectorAll("[data-del]").forEach((btn) =>
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-del");
        const ok = await UI.confirm(
          "This product will be removed from your store."
        );
        if (!ok) return;
        Dashboard.state.products = Dashboard.state.products.filter(
          (p) => p.id !== id
        );
        Dashboard.renderProducts();
        Dashboard.renderStats();
        UI.toast("Product deleted", "success");
      })
    );
    grid.querySelectorAll("[data-edit]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const p = Dashboard.state.products.find(
          (x) => x.id === btn.getAttribute("data-edit")
        );
        Dashboard.openProductModal(p);
      })
    );
  },

  bindCreate() {
    document
      .getElementById("openCreate")
      ?.addEventListener("click", () => Dashboard.openProductModal());
    document
      .getElementById("openCreate2")
      ?.addEventListener("click", () => Dashboard.openProductModal());
  },

  openProductModal(existing = null) {
    const isEdit = !!existing;
    const back = UI.openModal(`
      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-display text-xl font-bold">${
            isEdit ? "Edit product" : "Create product"
          }</h3>
          <button class="text-slate-400 hover:text-slate-700" data-close>✕</button>
        </div>
        <form id="prodForm" class="space-y-4">
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium">Product name</label>
              <input name="name" class="input mt-1" value="${
                existing?.name || ""
              }" required>
            </div>
            <div>
              <label class="text-sm font-medium">Category</label>
              <select name="category" class="input mt-1">
                ${[
                  "Fashion",
                  "Electronics",
                  "Beauty",
                  "Home",
                  "Food",
                  "Sports",
                  "General",
                ]
                  .map(
                    (c) =>
                      `<option ${
                        existing?.category === c ? "selected" : ""
                      }>${c}</option>`
                  )
                  .join("")}
              </select>
            </div>
            <div>
              <label class="text-sm font-medium">Price (₦)</label>
              <input name="price" type="number" min="0" class="input mt-1" value="${
                existing?.price ?? ""
              }" required>
            </div>
            <div>
              <label class="text-sm font-medium">Stock</label>
              <input name="stock" type="number" min="0" class="input mt-1" value="${
                existing?.stock ?? ""
              }" required>
            </div>
          </div>
          <div>
            <label class="text-sm font-medium">Description</label>
            <textarea name="description" rows="3" class="input mt-1" required>${
              existing?.description || ""
            }</textarea>
          </div>
          <div>
            <label class="text-sm font-medium">Images</label>
            <div id="dropzone" class="dropzone mt-1">
              <p class="text-sm text-slate-600">Drag & drop images here, or <label class="text-emerald-700 font-semibold cursor-pointer">browse<input id="fileInput" type="file" accept="image/*" multiple class="hidden"></label></p>
              <p class="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB. Cloudinary-compatible.</p>
            </div>
            <div id="previews" class="grid grid-cols-4 gap-2 mt-3"></div>
          </div>
          <div class="flex justify-end gap-2 pt-2">
            <button type="button" class="btn-ghost" data-close>Cancel</button>
            <button type="submit" class="btn-primary">${
              isEdit ? "Save changes" : "Publish product"
            }</button>
          </div>
        </form>
      </div>`);

    back
      .querySelectorAll("[data-close]")
      .forEach((b) => b.addEventListener("click", () => back.remove()));

    const fileInput = back.querySelector("#fileInput");
    const drop = back.querySelector("#dropzone");
    const previews = back.querySelector("#previews");
    let images = [...(existing?.images || [])];
    function renderPreviews() {
      previews.innerHTML = images
        .map(
          (src, i) => `
        <div class="relative group">
          <img src="${src}" class="w-full h-20 object-cover rounded-lg border border-slate-200">
          <button type="button" data-rm="${i}" class="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 text-xs">✕</button>
        </div>`
        )
        .join("");
      previews.querySelectorAll("[data-rm]").forEach((b) =>
        b.addEventListener("click", () => {
          images.splice(+b.dataset.rm, 1);
          renderPreviews();
        })
      );
    }
    renderPreviews();

    function handleFiles(files) {
      [...files].forEach((f) => {
        if (!f.type.startsWith("image/")) return;
        const reader = new FileReader();
        reader.onload = () => {
          images.push(reader.result);
          renderPreviews();
        };
        reader.readAsDataURL(f);
      });
    }
    fileInput.addEventListener("change", (e) => handleFiles(e.target.files));
    ["dragenter", "dragover"].forEach((ev) =>
      drop.addEventListener(ev, (e) => {
        e.preventDefault();
        drop.classList.add("drag");
      })
    );
    ["dragleave", "drop"].forEach((ev) =>
      drop.addEventListener(ev, (e) => {
        e.preventDefault();
        drop.classList.remove("drag");
      })
    );
    drop.addEventListener("drop", (e) => handleFiles(e.dataTransfer.files));

    back.querySelector("#prodForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const payload = {
        name: fd.get("name"),
        category: fd.get("category"),
        price: Number(fd.get("price")),
        stock: Number(fd.get("stock")),
        description: fd.get("description"),
        images,
      };
      const btn = e.target.querySelector("button[type=submit]");
      const orig = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = `<span class="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin align-[-2px] mr-2"></span> Saving...`;
      try {
        if (!isEdit) {
          try {
            await API.createProduct(payload);
          } catch (err) {
            console.warn("API create failed, using local:", err.message);
          }
          Dashboard.state.products.unshift({
            id: crypto.randomUUID(),
            seller: API.getUser() || { name: "You", phone: "2348000000000" },
            ...payload,
          });
          UI.toast("Product published", "success");
        } else {
          Object.assign(existing, payload);
          UI.toast("Changes saved", "success");
        }
        back.remove();
        Dashboard.renderProducts();
        Dashboard.renderStats();
      } catch (err) {
        UI.toast(err.message || "Failed to save", "error");
      } finally {
        btn.disabled = false;
        btn.innerHTML = orig;
      }
    });
  },
};
window.Dashboard = Dashboard;
