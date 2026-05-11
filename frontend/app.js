const API_URL = "http://127.0.0.1:8000";

async function loadProducts() {
  const res = await fetch(`${API_URL}/products`);
  const products = await res.json();

  const container = document.getElementById("products");

  products.forEach((p) => {
    const div = document.createElement("div");

    div.className = "bg-white p-4 shadow rounded";

    div.innerHTML = `
      <h2 class="font-bold">${p.name}</h2>
      <p>₦${p.price}</p>
    `;

    container.appendChild(div);
  });
}

async function createProduct() {
  const token = localStorage.getItem("token");

  await fetch(`${API_URL}/products/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: document.getElementById("name").value,
      description: "sample",
      price: Number(document.getElementById("price").value),
      stock: Number(document.getElementById("stock").value),
    }),
  });

  alert("Product created!");
}

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  localStorage.setItem("token", data.access_token);

  window.location.href = "dashboard.html";
}

loadProducts();
