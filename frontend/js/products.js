// Product listing, filtering, rendering, demo data
const DEMO_PRODUCTS = [
  { id: "d1", name: "Ankara Print Kaftan", price: 18500, stock: 12, category: "Fashion", description: "Premium handcrafted Ankara kaftan tailored in Lagos. Lightweight and breathable.", images: ["https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800"], seller: { name: "Lagos Threads", phone: "2348012345678" } },
  { id: "d2", name: "Wireless Bluetooth Earbuds", price: 24900, stock: 38, category: "Electronics", description: "Crystal-clear sound with 24-hour battery life and noise cancellation.", images: ["https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800"], seller: { name: "AbujaTech", phone: "2348087654321" } },
  { id: "d3", name: "Shea Butter Skincare Set", price: 9500, stock: 0, category: "Beauty", description: "100% organic Nigerian shea butter set with cleanser, moisturizer and lip balm.", images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800"], seller: { name: "PureGlow NG", phone: "2348023456789" } },
  { id: "d4", name: "Leather Crossbody Bag", price: 32000, stock: 7, category: "Fashion", description: "Genuine leather, handmade in Aba. Fits a 10-inch tablet and essentials.", images: ["https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800"], seller: { name: "Aba Leatherworks", phone: "2348034567890" } },
  { id: "d5", name: "Smart Home LED Bulb", price: 4200, stock: 120, category: "Electronics", description: "Wi-Fi controlled RGB bulb. Works with Alexa and Google Home.", images: ["https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=800"], seller: { name: "AbujaTech", phone: "2348087654321" } },
  { id: "d6", name: "Jollof Rice Spice Mix", price: 1800, stock: 50, category: "Food", description: "Authentic Nigerian jollof spice blend. Family-recipe, ready in minutes.", images: ["https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800"], seller: { name: "Mama's Kitchen", phone: "2348045678901" } },
  { id: "d7", name: "Adire Throw Pillow Pair", price: 7500, stock: 22, category: "Home", description: "Hand-dyed adire pillow covers. Set of two, 18x18 inches.", images: ["https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800"], seller: { name: "Yoruba Living", phone: "2348056789012" } },
  { id: "d8", name: "Fitness Resistance Bands", price: 6800, stock: 31, category: "Sports", description: "Set of 5 latex-free resistance bands with door anchor and carry bag.", images: ["https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800"], seller: { name: "FitNaija", phone: "2348067890123" } },
];

const Products = {
  cache: [],

  async fetchAll() {
    try {
      const data = await API.listProducts();
      const list = Array.isArray(data) ? data : (data?.products || data?.data || []);
      Products.cache = list.length ? list.map(Products.normalize) : DEMO_PRODUCTS;
    } catch (e) {
      console.warn("Falling back to demo products:", e.message);
      Products.cache = DEMO_PRODUCTS;
    }
    return Products.cache;
  },

  normalize(p) {
    return {
      id: p.id || p._id || crypto.randomUUID(),
      name: p.name || "Untitled",
      price: Number(p.price ?? 0),
      stock: Number(p.stock ?? 0),
      category: p.category || "General",
      description: p.description || "",
      images: p.images || (p.image ? [p.image] : []),
      seller: p.seller || { name: "Naijamart Seller", phone: "2348000000000" }
    };
  },

  card(p) {
    const inStock = p.stock > 0;
    const img = p.images?.[0] || "https://placehold.co/600x600?text=No+Image";
    return `
      <article class="card card-hover overflow-hidden flex flex-col">
        <a href="product.html?id=${encodeURIComponent(p.id)}" class="block aspect-square overflow-hidden bg-slate-100">
          <img src="${img}" alt="${p.name}" loading="lazy" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"/>
        </a>
        <div class="p-4 flex-1 flex flex-col">
          <div class="flex items-start justify-between gap-2">
            <h3 class="font-semibold text-slate-900 clamp-2 leading-snug">
              <a href="product.html?id=${encodeURIComponent(p.id)}" class="hover:text-emerald-700">${p.name}</a>
            </h3>
            <span class="badge ${inStock ? 'badge-success' : 'badge-danger'} shrink-0">${inStock ? 'In stock' : 'Sold out'}</span>
          </div>
          <p class="text-xs text-slate-500 mt-1">${p.category}</p>
          <div class="mt-3 flex items-end justify-between">
            <span class="font-display text-xl font-bold">${UI.formatNaira(p.price)}</span>
          </div>
          <a href="${UI.whatsappUrl(p.seller?.phone, p.name)}" target="_blank" rel="noopener" class="btn-wa mt-4 w-full justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.554-5.338 11.89-11.893 11.89a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.607zM17.367 14.43c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.298-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.371s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.077 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413z"/></svg>
            WhatsApp
          </a>
        </div>
      </article>`;
  },

  skeletons(n = 8) {
    return Array.from({ length: n }).map(() => `
      <div class="card overflow-hidden">
        <div class="skeleton aspect-square w-full"></div>
        <div class="p-4 space-y-3">
          <div class="skeleton h-4 w-3/4"></div>
          <div class="skeleton h-3 w-1/3"></div>
          <div class="skeleton h-6 w-1/2"></div>
          <div class="skeleton h-9 w-full"></div>
        </div>
      </div>`).join("");
  },

  emptyState(msg = "No products found") {
    return `
      <div class="col-span-full text-center py-16">
        <div class="mx-auto w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><path d="M3 3h2l.4 2M7 13h10l3-8H6.4M7 13l-1.5-7.5M7 13l-2 5h12"/><circle cx="9" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/></svg>
        </div>
        <h3 class="font-semibold text-slate-800">${msg}</h3>
        <p class="text-sm text-slate-500 mt-1">Try adjusting your search or filter.</p>
      </div>`;
  },

  applyFilters(list, { q, category }) {
    return list.filter(p => {
      const matchesQ = !q || p.name.toLowerCase().includes(q.toLowerCase()) || p.description.toLowerCase().includes(q.toLowerCase());
      const matchesC = !category || category === "All" || p.category === category;
      return matchesQ && matchesC;
    });
  },

  uniqueCategories(list) {
    return ["All", ...Array.from(new Set(list.map(p => p.category)))];
  }
};
window.Products = Products;
window.DEMO_PRODUCTS = DEMO_PRODUCTS;
