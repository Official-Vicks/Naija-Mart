// Auth flows
const Auth = {
  validateEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e || ""); },

  bindLogin(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = form.email.value.trim();
      const password = form.password.value;
      if (!Auth.validateEmail(email)) return UI.toast("Enter a valid email", "error");
      if (!password || password.length < 6) return UI.toast("Password must be 6+ characters", "error");

      const btn = form.querySelector("button[type=submit]");
      const original = btn.innerHTML;
      btn.disabled = true; btn.innerHTML = `<span class="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin align-[-2px] mr-2"></span> Signing in...`;
      try {
        const data = await API.login({ email, password });
        const token = data?.access_token || data?.token;
        if (!token) throw new Error("No token returned");
        API.setToken(token);
        if (data.user) API.setUser(data.user); else API.setUser({ email });
        UI.toast("Welcome back!", "success");
        setTimeout(() => location.href = "dashboard.html", 600);
      } catch (err) {
        UI.toast(err.message || "Login failed", "error");
      } finally { btn.disabled = false; btn.innerHTML = original; }
    });
  },

  bindRegister(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const store = form.store.value.trim();
      const phone = form.phone.value.trim();
      const email = form.email.value.trim();
      const password = form.password.value;
      const confirm = form.confirm.value;
      if (!name) return UI.toast("Enter your full name", "error");
      if (!store) return UI.toast("Enter your store name", "error");
      if (!/^(\+?234|0)[0-9]{10}$/.test(phone)) return UI.toast("Enter a valid Nigerian phone number", "error");
      if (!Auth.validateEmail(email)) return UI.toast("Invalid email", "error");
      if (password.length < 6) return UI.toast("Password must be 6+ chars", "error");
      if (password !== confirm) return UI.toast("Passwords do not match", "error");

      const btn = form.querySelector("button[type=submit]");
      const original = btn.innerHTML;
      btn.disabled = true; btn.innerHTML = `<span class="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin align-[-2px] mr-2"></span> Creating account...`;
      try {
        const data = await API.register({ name, store_name: store, phone, email, password });
        const token = data?.access_token || data?.token;
        if (token) { API.setToken(token); API.setUser(data.user || { email, name, store_name: store, phone }); }
        UI.toast("Account created!", "success");
        setTimeout(() => location.href = token ? "dashboard.html" : "login.html", 700);
      } catch (err) {
        UI.toast(err.message || "Registration failed", "error");
      } finally { btn.disabled = false; btn.innerHTML = original; }
    });
  },

  requireAuth() {
    if (!API.getToken()) {
      UI.toast("Please sign in", "error");
      setTimeout(() => location.href = "login.html", 600);
      return false;
    }
    return true;
  },

  logout() { API.clearToken(); location.href = "index.html"; }
};
window.Auth = Auth;
