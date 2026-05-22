// Contact form + Careers job listings & apply modal (drag-and-drop CV upload)
const Contact = {
  bindForm(form) {
    if (!form) return;
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      if (!data.name || !data.email || !data.message) {
        UI.toast("Please fill in all required fields.", "error");
        return;
      }
      const btn = form.querySelector("button[type=submit], button.btn-primary");
      const orig = btn.textContent; btn.disabled = true; btn.textContent = "Sending…";
      try {
        if (typeof API !== "undefined" && API.post) {
          try { await API.post("/contact", data); } catch (_) { /* graceful demo fallback */ }
        }
        await new Promise(r => setTimeout(r, 600));
        UI.toast("Message sent! We'll reply within 1 business day.", "success");
        form.reset();
      } catch (err) {
        UI.toast("Could not send message. Try again.", "error");
      } finally {
        btn.disabled = false; btn.textContent = orig;
      }
    });
  }
};

const Careers = {
  jobs: [
    { id: 1, title: "Senior Frontend Engineer", team: "Engineering", location: "Lagos / Remote", type: "Full-time", salary: "₦9M – ₦14M" },
    { id: 2, title: "Backend Engineer (FastAPI)", team: "Engineering", location: "Remote (Nigeria)", type: "Full-time", salary: "₦8M – ₦13M" },
    { id: 3, title: "Product Designer", team: "Design", location: "Lagos", type: "Full-time", salary: "₦7M – ₦11M" },
    { id: 4, title: "Growth Marketer", team: "Growth", location: "Remote", type: "Full-time", salary: "₦6M – ₦9M" },
    { id: 5, title: "Customer Success Lead", team: "Operations", location: "Lagos", type: "Full-time", salary: "₦5M – ₦8M" },
    { id: 6, title: "Mobile Engineer (React Native)", team: "Engineering", location: "Remote", type: "Contract", salary: "₦1.2M / month" },
  ],
  card(j) {
    return `
    <div class="card p-6 flex flex-col">
      <div class="flex items-start justify-between gap-3">
        <div>
          <span class="badge badge-success">${j.team}</span>
          <h3 class="font-display text-lg font-bold mt-3">${j.title}</h3>
          <p class="text-sm text-slate-500 mt-1">${j.location} · ${j.type}</p>
        </div>
        <p class="text-xs text-slate-500 whitespace-nowrap">${j.salary}</p>
      </div>
      <div class="mt-5 flex gap-2">
        <button class="btn-primary" data-apply="${j.id}">Apply now</button>
      </div>
    </div>`;
  },
  render(host) {
    if (!host) return;
    host.innerHTML = this.jobs.map(this.card).join("");
    host.addEventListener("click", (e) => {
      const id = e.target?.dataset?.apply;
      if (!id) return;
      const job = this.jobs.find(j => String(j.id) === String(id));
      if (job) Careers.openApply(job);
    });
  },
  openApply(job) {
    const back = UI.openModal(`
      <div class="p-6 max-w-lg w-full">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h3 class="font-display text-xl font-bold">Apply: ${job.title}</h3>
            <p class="text-sm text-slate-500 mt-1">${job.team} · ${job.location}</p>
          </div>
          <button class="text-slate-400 hover:text-slate-700" data-close>✕</button>
        </div>
        <form id="applyForm" class="space-y-3 mt-5">
          <div class="grid sm:grid-cols-2 gap-3">
            <input name="name" required class="input" placeholder="Full name"/>
            <input name="email" type="email" required class="input" placeholder="Email"/>
          </div>
          <input name="link" class="input" placeholder="LinkedIn or portfolio URL (optional)"/>
          <textarea name="cover" rows="3" class="input" placeholder="Why are you a great fit?"></textarea>

          <div id="dropzone" class="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center cursor-pointer hover:border-emerald-400 transition">
            <p class="text-sm text-slate-600"><b>Drop your CV here</b> or click to upload</p>
            <p class="text-xs text-slate-400 mt-1">PDF or DOCX, up to 5MB</p>
            <p id="fileName" class="text-xs text-emerald-700 font-medium mt-2 hidden"></p>
            <input id="cvInput" type="file" accept=".pdf,.doc,.docx" class="hidden"/>
          </div>

          <button class="btn-primary w-full" type="submit">Submit application</button>
        </form>
      </div>`);

    const modal = back;
    modal.querySelector("[data-close]").addEventListener("click", () => modal.remove());

    const dz = modal.querySelector("#dropzone");
    const input = modal.querySelector("#cvInput");
    const nameEl = modal.querySelector("#fileName");
    let file = null;
    const setFile = (f) => {
      if (!f) return;
      if (f.size > 5 * 1024 * 1024) { UI.toast("File too large (max 5MB).", "error"); return; }
      file = f;
      nameEl.textContent = `📎 ${f.name} (${(f.size/1024).toFixed(0)} KB)`;
      nameEl.classList.remove("hidden");
    };
    dz.addEventListener("click", () => input.click());
    input.addEventListener("change", (e) => setFile(e.target.files[0]));
    ["dragenter","dragover"].forEach(ev => dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.add("border-emerald-500","bg-emerald-50"); }));
    ["dragleave","drop"].forEach(ev => dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.remove("border-emerald-500","bg-emerald-50"); }));
    dz.addEventListener("drop", (e) => { if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]); });

    modal.querySelector("#applyForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target).entries());
      if (!data.name || !data.email) { UI.toast("Please complete required fields.", "error"); return; }
      if (!file) { UI.toast("Please attach your CV.", "error"); return; }
      const btn = e.target.querySelector("button[type=submit]");
      btn.disabled = true; btn.textContent = "Submitting…";
      await new Promise(r => setTimeout(r, 700));
      modal.remove();
      UI.toast("Application sent. We'll be in touch! ✨", "success");
    });
  }
};

window.Contact = Contact;
window.Careers = Careers;
