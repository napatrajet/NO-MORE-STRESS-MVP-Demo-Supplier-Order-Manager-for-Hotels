// State & Demo Data matching reference screens + extended advance delivery dates
const state = {
  selectedDate: "17 Aug",
  orderFilter: "all",
  appPermissions: [
    {
      id: "line",
      name: "LINE Official / LINE Chat",
      desc: "อ่านข้อความแชตและสแกนรูปภาพใบสั่งซื้อจากเชฟโรงแรม",
      enabled: true
    },
    {
      id: "gmail",
      name: "Gmail (PDF & Excel PO)",
      desc: "ดึงไฟล์แนบใบสั่งซื้อ (PO) จากฝ่ายจัดซื้อโรงแรมอัตโนมัติ",
      enabled: true
    },
    {
      id: "whatsapp",
      name: "WhatsApp / Google Drive",
      desc: "ซิงก์ไฟล์ตารางสั่งของล่วงหน้ารายสัปดาห์",
      enabled: false
    }
  ],
  connectedStores: [
    {
      id: "store-veggie",
      name: "เจ๊พร ผักสด (ตลาดไท)",
      category: "หมวดผักใบ & ผักหัว (Tomato, Lettuce, Carrot, Onion, Cucumber)",
      enabled: true
    },
    {
      id: "store-herb",
      name: "สี่มุมเมือง ออร์แกนิก & สมุนไพร",
      category: "หมวดเครื่องเทศ & ผักสลัดพรีเมียม",
      enabled: true
    },
    {
      id: "store-dry",
      name: "FreshPack Wholesale",
      category: "หมวดของแห้ง & ผลไม้นำเข้า",
      enabled: false
    }
  ],
  orders: [
    {
      id: "PO-08465",
      hotel: "Novotel Bangkok",
      deliveryDate: "17 Aug",
      dateLabel: "วันนี้ (Today)",
      source: "LINE",
      sourceFormat: "รูปภาพใบเขียนมือ + ข้อความแชต",
      rawEvidence: "Chef Somchai (LINE 07:45): 'ส่งครัวเช้า 17 Aug ครับ มะเขือเทศ 4 โล, ผักกาดหอม 3 โล, แครอท 3 โล'",
      status: "new",
      items: [
        { name: "Tomato", emoji: "🍅", qty: 4, unit: "kg", store: "เจ๊พร ผักสด (ตลาดไท)", checked: false },
        { name: "Lettuce", emoji: "🥬", qty: 3, unit: "kg", store: "เจ๊พร ผักสด (ตลาดไท)", checked: false },
        { name: "Carrot", emoji: "🥕", qty: 3, unit: "kg", store: "เจ๊พร ผักสด (ตลาดไท)", checked: false }
      ]
    },
    {
      id: "PO-08466",
      hotel: "Sofitel Bangkok",
      deliveryDate: "17 Aug",
      dateLabel: "วันนี้ (Today)",
      source: "Gmail",
      sourceFormat: "ไฟล์ PDF แนบทางอีเมล (Purchasing Dept.)",
      rawEvidence: "Subject: Daily Kitchen PO-08466 (Delivery 17 Aug) — Attached: Sofitel_Veg_Order.pdf",
      status: "sent",
      items: [
        { name: "Tomato", emoji: "🍅", qty: 4, unit: "kg", store: "เจ๊พร ผักสด (ตลาดไท)", checked: true },
        { name: "Lettuce", emoji: "🥬", qty: 2, unit: "kg", store: "เจ๊พร ผักสด (ตลาดไท)", checked: true },
        { name: "Carrot", emoji: "🥕", qty: 3, unit: "kg", store: "เจ๊พร ผักสด (ตลาดไท)", checked: false },
        { name: "Onion", emoji: "🧅", qty: 3, unit: "kg", store: "เจ๊พร ผักสด (ตลาดไท)", checked: false },
        { name: "Cucumber", emoji: "🥒", qty: 4, unit: "kg", store: "เจ๊พร ผักสด (ตลาดไท)", checked: false }
      ]
    },
    {
      id: "PO-08467",
      hotel: "The Berkeley",
      deliveryDate: "18 Aug",
      dateLabel: "พรุ่งนี้ (Advance)",
      source: "LINE",
      sourceFormat: "ข้อความสั่งล่วงหน้าทาง LINE",
      rawEvidence: "Purchasing Berkeley (LINE): 'ขอลงออเดอร์ล่วงหน้าสำหรับวันที่ 18 Aug นะคะ Tomato 6 kg, Carrot 4 kg, Onion 5 kg'",
      status: "new",
      items: [
        { name: "Tomato", emoji: "🍅", qty: 6, unit: "kg", store: "เจ๊พร ผักสด (ตลาดไท)", checked: false },
        { name: "Carrot", emoji: "🥕", qty: 4, unit: "kg", store: "เจ๊พร ผักสด (ตลาดไท)", checked: false },
        { name: "Onion", emoji: "🧅", qty: 5, unit: "kg", store: "เจ๊พร ผักสด (ตลาดไท)", checked: false }
      ]
    }
  ]
};

function getOrderTotalKg(order) {
  return order.items.reduce((sum, item) => sum + item.qty, 0);
}

function getUniqueDates() {
  const map = new Map();
  state.orders.forEach(o => {
    if (!map.has(o.deliveryDate)) {
      map.set(o.deliveryDate, o.dateLabel || "ล่วงหน้า");
    }
  });
  return Array.from(map.entries()).map(([date, label]) => ({ date, label }));
}

function showToast(msg) {
  const el = document.getElementById("toast-msg");
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2600);
}

function switchTab(tabName, filterOverride = null) {
  document.querySelectorAll(".view-section").forEach(sec => sec.classList.remove("active"));
  document.getElementById(`view-${tabName}`).classList.add("active");

  document.querySelectorAll(".nav-item").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === tabName);
  });

  if (filterOverride) {
    state.orderFilter = filterOverride;
  }

  renderAll();
  document.getElementById("app-main").scrollTop = 0;
}

function renderOrderCard(order) {
  const totalKg = getOrderTotalKg(order);
  const statusText = order.status === "new" ? "🟡 เข้าใหม่จากโรงแรม" : "🟢 ส่งสั่งซื้อร้านค้าแล้ว";
  const sourceClass = order.source.toLowerCase() === "gmail" ? "gmail" : "line";

  return `
    <div class="order-card" onclick="openOrderModal('${order.id}')">
      <div class="order-card-left">
        <div class="order-hotel-row">
          <span class="order-hotel-name">${order.hotel}</span>
          <span class="source-tag ${sourceClass}">${order.source}</span>
        </div>
        <div class="order-meta">Delivery: ${order.deliveryDate} · ${order.id}</div>
        <div class="order-badges-row">
          <span class="state-pill ${order.status}">${statusText}</span>
          <span class="weight-pill">${totalKg} kg</span>
        </div>
      </div>
      <span class="chevron">&rsaquo;</span>
    </div>
  `;
}

function renderHome() {
  const todayOrders = state.orders.filter(o => o.deliveryDate === "17 Aug");
  const targetOrders = todayOrders.length ? todayOrders : state.orders;

  const uniqueHotels = new Set(targetOrders.map(o => o.hotel)).size;
  const totalOrdersCount = state.orders.length;
  const todayTotalKg = targetOrders.reduce((sum, o) => sum + getOrderTotalKg(o), 0);

  document.getElementById("kpi-hotels").textContent = uniqueHotels;
  document.getElementById("kpi-orders").textContent = totalOrdersCount;
  document.getElementById("kpi-weight").textContent = todayTotalKg;

  const newCount = state.orders.filter(o => o.status === "new").length;
  const sentCount = state.orders.filter(o => o.status === "sent").length;
  document.getElementById("count-new-orders").textContent = newCount;
  document.getElementById("count-sent-orders").textContent = sentCount;

  const activeApps = state.appPermissions.filter(a => a.enabled).map(a => a.name.split(" ")[0]).join(", ") || "ยังไม่เปิดใช้งาน";
  const activeStoresCount = state.connectedStores.filter(s => s.enabled).length;
  document.getElementById("active-apps-label").textContent = `เชื่อมต่อ: ${activeApps} · ร้านค้าส่ง ${activeStoresCount} แห่ง`;

  document.getElementById("home-recent-orders").innerHTML = state.orders.map(renderOrderCard).join("");
}

function renderOrdersTab() {
  document.querySelectorAll("#order-filter-pills .pill-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.filter === state.orderFilter);
    btn.onclick = () => {
      state.orderFilter = btn.dataset.filter;
      renderOrdersTab();
    };
  });

  const filtered = state.orders.filter(o => {
    if (state.orderFilter === "all") return true;
    return o.status === state.orderFilter;
  });

  document.getElementById("all-orders-list").innerHTML = filtered.length
    ? filtered.map(renderOrderCard).join("")
    : `<p style="text-align:center;color:#64748B;padding:24px 0;font-size:13px;">ไม่มีรายการในหมวดหมู่นี้</p>`;
}

function renderPoTab() {
  document.getElementById("app-permissions-list").innerHTML = state.appPermissions.map(app => `
    <div class="toggle-row">
      <div>
        <div class="toggle-info-title">${app.name}</div>
        <div class="toggle-info-sub">${app.desc}</div>
      </div>
      <label class="switch">
        <input type="checkbox" ${app.enabled ? "checked" : ""} onchange="toggleAppPermission('${app.id}')">
        <span class="slider"></span>
      </label>
    </div>
  `).join("");

  document.getElementById("store-connections-list").innerHTML = state.connectedStores.map(store => `
    <div class="toggle-row">
      <div>
        <div class="toggle-info-title">${store.name}</div>
        <div class="toggle-info-sub">${store.category}</div>
      </div>
      <label class="switch">
        <input type="checkbox" ${store.enabled ? "checked" : ""} onchange="toggleStoreConnection('${store.id}')">
        <span class="slider"></span>
      </label>
    </div>
  `).join("");
}

function toggleAppPermission(id) {
  const target = state.appPermissions.find(a => a.id === id);
  if (target) {
    target.enabled = !target.enabled;
    showToast(`${target.enabled ? "อนุญาต" : "ปิดการเข้าถึง"} ${target.name} แล้ว`);
    renderHome();
  }
}

function toggleStoreConnection(id) {
  const target = state.connectedStores.find(s => s.id === id);
  if (target) {
    target.enabled = !target.enabled;
    showToast(`${target.enabled ? "เชื่อมต่อ" : "ยกเลิกเชื่อมต่อ"} ${target.name} แล้ว`);
    renderHome();
    renderShoppingTab();
  }
}

function fillSampleText() {
  document.getElementById("quick-order-input").value =
    "Grand Hyatt ส่งวันที่ 18 Aug
Tomato 5 kg, Lettuce 4 kg, Cucumber 3 kg";
}

function parseIncomingOrder() {
  const raw = document.getElementById("quick-order-input").value.trim();
  if (!raw) {
    showToast("กรุณาใส่ข้อความออเดอร์หรือกดปุ่มตัวอย่างก่อนครับ");
    return;
  }

  const lines = raw.split("
");
  const headerLine = lines[0] || "New Hotel";
  const hotelName = headerLine.split("ส่ง")[0].trim() || "Grand Hyatt Bangkok";
  const dateMatch = raw.match(/(\d{1,2}\s*[A-Za-z]{3})/);
  const deliveryDate = dateMatch ? dateMatch[1] : "18 Aug";

  const emojiMap = {
    tomato: "🍅", "มะเขือเทศ": "🍅",
    lettuce: "🥬", "ผักกาด": "🥬",
    carrot: "🥕", "แครอท": "🥕",
    onion: "🧅", "หอมใหญ่": "🧅",
    cucumber: "🥒", "แตงกวา": "🥒"
  };

  const items = [];
  const itemRegex = /([A-Za-zก-๙]+)\s*(\d+(?:\.\d+)?)\s*(?:kg|กก\.|โล)/gi;
  let match;
  while ((match = itemRegex.exec(raw)) !== null) {
    const rawName = match[1];
    const qty = parseFloat(match[2]);
    const key = rawName.toLowerCase();
    const emoji = Object.entries(emojiMap).find(([k]) => key.includes(k))?.[1] || "📦";
    items.push({
      name: rawName.charAt(0).toUpperCase() + rawName.slice(1),
      emoji,
      qty,
      unit: "kg",
      store: "เจ๊พร ผักสด (ตลาดไท)",
      checked: false
    });
  }

  if (!items.length) {
    items.push({ name: "Mixed Vegetables", emoji: "🥬", qty: 5, unit: "kg", store: "เจ๊พร ผักสด (ตลาดไท)", checked: false });
  }

  const newPoNum = `PO-084${65 + state.orders.length}`;
  state.orders.unshift({
    id: newPoNum,
    hotel: hotelName,
    deliveryDate,
    dateLabel: deliveryDate === "17 Aug" ? "วันนี้ (Today)" : "ล่วงหน้า (Advance)",
    source: "LINE",
    sourceFormat: "ดึงอัตโนมัติจากข้อความแชต",
    rawEvidence: raw,
    status: "new",
    items
  });

  document.getElementById("quick-order-input").value = "";
  showToast(`เพิ่มออเดอร์ ${newPoNum} (${hotelName}) เรียบร้อย!`);
  switchTab("home");
}

function renderScheduleTab() {
  const dates = getUniqueDates();
  if (!dates.some(d => d.date === state.selectedDate) && dates.length) {
    state.selectedDate = dates[0].date;
  }

  document.getElementById("schedule-date-tabs").innerHTML = dates.map(d => `
    <div class="date-chip ${d.date === state.selectedDate ? "active" : ""}" onclick="selectScheduleDate('${d.date}')">
      <div class="date-chip-day">${d.date}</div>
      <div class="date-chip-tag">${d.label}</div>
    </div>
  `).join("");

  const dayOrders = state.orders.filter(o => o.deliveryDate === state.selectedDate);
  const totalKg = dayOrders.reduce((s, o) => s + getOrderTotalKg(o), 0);

  document.getElementById("schedule-summary-banner").innerHTML = `
    <span>รอบจัดส่งวันที่ <strong>${state.selectedDate}</strong> (${dayOrders.length} โรงแรม)</span>
    <span>รวม <strong>${totalKg} kg</strong></span>
  `;

  document.getElementById("schedule-orders-list").innerHTML = dayOrders.map(renderOrderCard).join("");
}

function selectScheduleDate(dateStr) {
  state.selectedDate = dateStr;
  renderScheduleTab();
  renderShoppingTab();
}

function changeShoppingDate(dateStr) {
  state.selectedDate = dateStr;
  renderShoppingTab();
}

function renderShoppingTab() {
  const dates = getUniqueDates();
  const selectEl = document.getElementById("shopping-date-select");
  selectEl.innerHTML = dates.map(d =>
    `<option value="${d.date}" ${d.date === state.selectedDate ? "selected" : ""}>${d.date}</option>`
  ).join("");

  document.getElementById("shopping-sub-text").textContent = `Consolidated quantities · ${state.selectedDate} · Demo`;

  const dayOrders = state.orders.filter(o => o.deliveryDate === state.selectedDate);
  const consolidated = new Map();

  dayOrders.forEach(order => {
    order.items.forEach(item => {
      if (!consolidated.has(item.name)) {
        consolidated.set(item.name, {
          name: item.name,
          emoji: item.emoji,
          qty: 0,
          unit: item.unit,
          store: item.store
        });
      }
      consolidated.get(item.name).qty += item.qty;
    });
  });

  const rows = Array.from(consolidated.values());
  const totalKg = rows.reduce((s, r) => s + r.qty, 0);

  document.getElementById("shopping-items-body").innerHTML = rows.map(r => `
    <div class="shopping-row">
      <div class="shopping-item-info">
        <div class="shopping-item-name"><span>${r.emoji}</span> <span>${r.name}</span></div>
        <div class="shopping-store-sub">ร้านค้าส่ง: ${r.store}</div>
      </div>
      <div class="shopping-item-qty">${r.qty} ${r.unit}</div>
    </div>
  `).join("");

  document.getElementById("shop-total-items").textContent = rows.length;
  document.getElementById("shop-total-kg").textContent = `${totalKg} kg`;

  const allSent = dayOrders.length > 0 && dayOrders.every(o => o.status === "sent");
  const btn = document.getElementById("btn-start-shopping");
  if (allSent) {
    btn.innerHTML = `✅ ส่งใบสั่งซื้อไปยังร้านค้าส่งเรียบร้อยแล้ว`;
    btn.style.background = "#15803D";
  } else {
    btn.innerHTML = `Start Shopping / ส่งสั่งซื้อร้านค้า <span>&rarr;</span>`;
    btn.style.background = "#181B20";
  }
}

function dispatchToConnectedStores() {
  const activeStores = state.connectedStores.filter(s => s.enabled);
  if (!activeStores.length) {
    showToast("กรุณาเปิดเชื่อมต่อร้านค้าส่งในแท็บ PO ก่อนครับ");
    switchTab("po");
    return;
  }

  state.orders.forEach(o => {
    if (o.deliveryDate === state.selectedDate) {
      o.status = "sent";
    }
  });

  showToast(`ส่งรายการรวมวันที่ ${state.selectedDate} ไปยัง ${activeStores[0].name} แล้ว!`);
  renderAll();
}

function renderChecklistTab() {
  let totalItems = 0;
  let checkedItems = 0;

  const html = state.orders.map((order, oIdx) => {
    const itemsHtml = order.items.map((item, iIdx) => {
      totalItems++;
      if (item.checked) checkedItems++;
      return `
        <label class="check-item ${item.checked ? "done" : ""}">
          <input type="checkbox" ${item.checked ? "checked" : ""} onchange="toggleCheckItem(${oIdx}, ${iIdx})">
          <span>${item.emoji} <strong>${item.name}</strong> — ${item.qty} ${item.unit}</span>
        </label>
      `;
    }).join("");

    return `
      <div class="checklist-group-card">
        <div class="checklist-group-title">
          <span>${order.hotel} (${order.id})</span>
          <span style="font-size:11.5px;color:#1E6FD9;">ส่ง ${order.deliveryDate}</span>
        </div>
        ${itemsHtml}
      </div>
    `;
  }).join("");

  document.getElementById("checklist-groups").innerHTML = html;
  document.getElementById("checklist-progress-text").textContent = `${checkedItems} / ${totalItems} รายการ`;
  const pct = totalItems ? Math.round((checkedItems / totalItems) * 100) : 0;
  document.getElementById("checklist-progress-fill").style.width = `${pct}%`;
}

function toggleCheckItem(orderIdx, itemIdx) {
  state.orders[orderIdx].items[itemIdx].checked = !state.orders[orderIdx].items[itemIdx].checked;
  renderChecklistTab();
}

function openOrderModal(orderId) {
  const order = state.orders.find(o => o.id === orderId);
  if (!order) return;

  document.getElementById("modal-po").textContent = `${order.id} · ส่งวันที่ ${order.deliveryDate}`;
  document.getElementById("modal-hotel").textContent = order.hotel;

  const totalKg = getOrderTotalKg(order);
  const itemsHtml = order.items.map(it => `
    <div class="modal-item-row">
      <span>${it.emoji} ${it.name} <small style="color:#64748B;">(${it.store})</small></span>
      <strong>${it.qty} ${it.unit}</strong>
    </div>
  `).join("");

  document.getElementById("modal-body-content").innerHTML = `
    <div class="evidence-box">
      <span class="evidence-label">📎 หลักฐานต้นฉบับ (${order.source} · ${order.sourceFormat})</span>
      <p style="color:#334155;line-height:1.45;">${order.rawEvidence}</p>
    </div>
    <h4 style="font-size:13.5px;margin-bottom:6px;">รายการสินค้าที่ถอดรหัสได้ (รวม ${totalKg} kg)</h4>
    ${itemsHtml}
    <div style="margin-top:16px;">
      <button class="btn-primary-dark" onclick="markSingleOrderSent('${order.id}')">
        ${order.status === "new" ? "ส่งสั่งซื้อไปยังร้านค้าส่งทันที →" : "✅ ส่งสั่งซื้อร้านค้าแล้ว (ปิดหน้าต่าง)"}
      </button>
    </div>
  `;

  document.getElementById("order-modal").classList.add("open");
}

function markSingleOrderSent(orderId) {
  const order = state.orders.find(o => o.id === orderId);
  if (order && order.status === "new") {
    order.status = "sent";
    showToast(`ส่งออเดอร์ ${order.id} ไปยังร้านค้าส่งเรียบร้อย!`);
    renderAll();
  }
  closeOrderModal();
}

function closeOrderModal(e) {
  if (!e || e.target.id === "order-modal") {
    document.getElementById("order-modal").classList.remove("open");
  }
}

function renderAll() {
  renderHome();
  renderOrdersTab();
  renderPoTab();
  renderScheduleTab();
  renderShoppingTab();
  renderChecklistTab();
}

// Initialize
renderAll();
