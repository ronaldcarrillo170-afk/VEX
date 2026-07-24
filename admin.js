const adminUser = JSON.parse(localStorage.getItem("usuarioActual")) || null;
const isAdmin = localStorage.getItem("usuario") === "admin" || adminUser?.correo === "admin@vex.com";

if(!isAdmin){ window.location.replace("login.html"); }

const currency = new Intl.NumberFormat("es-CO", {style:"currency",currency:"COP",maximumFractionDigits:0});
const els = {
sales:document.getElementById("total-sales"), profit:document.getElementById("total-profit"), orders:document.getElementById("total-orders"),
products:document.getElementById("products-sold"), salesCount:document.getElementById("sales-count"), pending:document.getElementById("pending-orders"),
chart:document.getElementById("sales-chart"), status:document.getElementById("status-summary"), ordersBody:document.getElementById("admin-orders"), empty:document.getElementById("empty-admin-orders")
};
const productDefaults = {"Hoodie VEX":89900,"Gorra VEX":39900,"Camiseta VEX":59900,"Outfit VEX":149900,"Caja Dulce":24900,"Combo Premium":129900,"Mix de Gomitas":18900,"Pack Chocolates":32900,"Hoodie Midnight":99900,"Camiseta Oversize":64900,"Jogger Urban":84900,"Chaqueta Varsity":139900,"Gorra Shadow":44900,"Tote Bag VEX":29900,"Brownie Intenso":14900,"Kit Cine Dulce":44900,"Trufas VEX":22900,"Gomitas Ácidas":16900,"Snack Box VEX":36900,"Mini Dulces Mix":12900};
const defaultProductImages = {"Hoodie VEX":"img/hoddie.jpg","Gorra VEX":"img/gorra vex.png","Camiseta VEX":"img/hoddie.jpg","Outfit VEX":"img/gorra vex.png","Caja Dulce":"img/caja dulces.jpg","Combo Premium":"img/Combo premiun.png","Mix de Gomitas":"img/caja dulces.jpg","Pack Chocolates":"img/Combo premiun.png","Hoodie Midnight":"img/hoddie.jpg","Camiseta Oversize":"img/hoddie.jpg","Jogger Urban":"img/hoddie.jpg","Chaqueta Varsity":"img/hoddie.jpg","Gorra Shadow":"img/gorra vex.png","Tote Bag VEX":"img/gorra vex.png","Brownie Intenso":"img/caja dulces.jpg","Kit Cine Dulce":"img/Combo premiun.png","Trufas VEX":"img/caja dulces.jpg","Gomitas Ácidas":"img/caja dulces.jpg","Snack Box VEX":"img/Combo premiun.png","Mini Dulces Mix":"img/caja dulces.jpg"};
const priceEditor = document.getElementById("price-editor");
const imageEditor = document.getElementById("image-editor");
const mapModal = document.getElementById("admin-map-modal");
const mapTitle = document.getElementById("admin-map-title");
const mapCustomer = document.getElementById("admin-map-customer");
const adminMap = document.getElementById("admin-delivery-map");
const statusInput = document.getElementById("admin-order-status");
const locationInput = document.getElementById("admin-order-location");
let selectedOrderId = null;
let pendingProductImages = JSON.parse(localStorage.getItem("imagenesVex")) || {};
let imagesLoading = 0;

function getOrders(){ return JSON.parse(localStorage.getItem("pedidos")) || []; }
function getStatus(order){
const step = Number.isInteger(order.estadoEntrega) ? order.estadoEntrega : 0;
return {step,label:["Confirmado","En empaque","En camino","Entregado"][step]};
}
function renderDashboard(){
const orders = getOrders();
const total = orders.reduce((sum,o) => sum + (o.total || 0),0);
const units = orders.reduce((sum,o) => sum + (o.productos || []).reduce((subtotal,p) => subtotal + (p.cantidad || 0),0),0);
const pending = orders.filter(o => getStatus(o).step < 3).length;
els.sales.textContent = currency.format(total);
els.profit.textContent = currency.format(Math.round(total * .60));
els.orders.textContent = orders.length;
els.products.textContent = units;
els.salesCount.textContent = `${orders.length} pedido${orders.length === 1 ? "" : "s"}`;
els.pending.textContent = `${pending} pendiente${pending === 1 ? "" : "s"} de entrega`;
renderChart(orders);
renderStatuses(orders);
renderOrders(orders);
}
function renderChart(orders){
els.chart.innerHTML = "";
const recent = orders.slice(0,7).reverse();
const max = Math.max(...recent.map(o => o.total || 0),1);
if(!recent.length){ els.chart.innerHTML = '<p class="empty-message">Todavía no hay ventas para graficar.</p>'; return; }
recent.forEach((order,index) => {
const bar = document.createElement("div"); bar.className="chart-bar";
bar.innerHTML = `<span>${currency.format(order.total)}</span><div style="height:${Math.max(12,Math.round(order.total / max * 150))}px"></div><small>#${index + 1}</small>`;
els.chart.appendChild(bar);
});
}
function renderStatuses(orders){
const labels = ["Confirmados","Preparando","En camino","Entregados"];
const icons = ["fa-receipt","fa-box","fa-motorcycle","fa-circle-check"];
const counts = [0,0,0,0]; orders.forEach(o => counts[getStatus(o).step]++);
els.status.innerHTML = labels.map((label,index) => `<div class="status-row"><span class="status-icon s${index}"><i class="fa-solid ${icons[index]}"></i></span><strong>${label}</strong><b>${counts[index]}</b></div>`).join("");
}
function renderOrders(orders){
els.ordersBody.innerHTML=""; els.empty.classList.toggle("hidden",orders.length !== 0);
orders.forEach(order => {
const state = getStatus(order); const row = document.createElement("tr");
row.innerHTML = `<td><strong>#${order.id}</strong><small>${order.fecha || "Sin fecha"}</small></td><td><strong>${order.nombre}</strong><small>${order.direccion}</small></td><td>${(order.productos || []).map(p => `${p.nombre} x${p.cantidad}`).join("<br>")}</td><td><span class="payment-chip">${order.metodoPago || "—"}</span></td><td><strong>${currency.format(order.total || 0)}</strong></td><td><span class="state-chip state-${state.step}">${state.label}</span></td><td><button class="detail-btn" data-id="${order.id}"><i class="fa-solid fa-location-dot"></i> Rastrear</button></td>`;
els.ordersBody.appendChild(row);
});
}
function renderPriceEditor(){
const saved = JSON.parse(localStorage.getItem("preciosVex")) || {};
priceEditor.innerHTML = Object.entries(productDefaults).map(([name,price]) => `<label class="price-item"><span>${name}</span><div><b>$</b><input type="number" min="1000" step="100" data-product="${name}" value="${saved[name] || price}"></div></label>`).join("");
}
function renderImageEditor(){
const saved = JSON.parse(localStorage.getItem("imagenesVex")) || {}; pendingProductImages = {...saved};
imageEditor.innerHTML = Object.keys(productDefaults).map(name => `<article class="image-item" data-product="${name}"><img src="${saved[name] || defaultProductImages[name]}" alt="${name}"><div class="image-item-info"><strong>${name}</strong><label class="image-upload"><i class="fa-solid fa-upload"></i> Elegir foto<input type="file" accept="image/*" data-product="${name}"></label><button type="button" class="restore-image" data-product="${name}">Restaurar</button></div></article>`).join("");
}
function readProductImage(file, product, preview){
if(!file || !file.type.startsWith("image/")){ alert("Selecciona una imagen válida."); return; }
if(file.size > 900 * 1024){ alert("La imagen debe pesar máximo 900 KB para poder guardarla en el navegador."); return; }
imagesLoading++; const saveButton = document.getElementById("save-images"); saveButton.disabled = true; saveButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Procesando foto';
const reader = new FileReader();
reader.onload = () => { pendingProductImages[product] = reader.result; preview.src = reader.result; };
reader.onerror = () => alert("No fue posible leer esta imagen.");
reader.onloadend = () => { imagesLoading--; if(imagesLoading === 0){ saveButton.disabled = false; saveButton.innerHTML = '<i class="fa-solid fa-images"></i> Guardar fotos'; } };
reader.readAsDataURL(file);
}
function normalizeProductName(value){ return value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]/g,""); }
document.getElementById("bulk-product-images").addEventListener("change",(event) => {
const productsByName = Object.keys(productDefaults).reduce((map,name) => { map[normalizeProductName(name)] = name; return map; },{});
let assigned = 0; const skipped = [];
Array.from(event.target.files).forEach(file => {
const filename = file.name.replace(/\.[^/.]+$/,""); const product = productsByName[normalizeProductName(filename)];
if(!product){ skipped.push(file.name); return; }
const preview = imageEditor.querySelector(`.image-item[data-product="${product}"] img`); readProductImage(file,product,preview); assigned++;
});
event.target.value = "";
if(!assigned) alert("No encontré productos con esos nombres. Usa el mismo nombre que aparece en el catálogo.");
else if(skipped.length) alert(`${assigned} foto(s) asignada(s). No se reconocieron: ${skipped.join(", ")}.`);
else alert(`${assigned} foto(s) asignada(s). Espera a que terminen de procesarse y pulsa Guardar fotos.`);
});
function openDeliveryControl(order){
const status = getStatus(order); selectedOrderId = order.id;
mapTitle.textContent = `Pedido #${order.id}`;
mapCustomer.textContent = `${order.nombre} · ${order.direccion}`;
statusInput.value = status.step;
locationInput.value = order.ubicacionRepartidor || "";
adminMap.className = `admin-delivery-map status-${status.step}`;
mapModal.classList.remove("hidden");
}
function closeDeliveryControl(){ mapModal.classList.add("hidden"); selectedOrderId=null; }
document.getElementById("refresh-dashboard").addEventListener("click",renderDashboard);
document.getElementById("logout-admin").addEventListener("click",() => { localStorage.removeItem("usuario"); localStorage.removeItem("usuarioActual"); window.location="login.html"; });
document.getElementById("admin-orders").addEventListener("click",e => { const btn=e.target.closest(".detail-btn"); if(btn){ const order=getOrders().find(item=>String(item.id)===btn.dataset.id); if(order) openDeliveryControl(order); } });
document.getElementById("save-prices").addEventListener("click",() => {
const prices={}; priceEditor.querySelectorAll("input").forEach(input => { prices[input.dataset.product]=Number(input.value); });
localStorage.setItem("preciosVex",JSON.stringify(prices));
document.getElementById("save-prices").innerHTML='<i class="fa-solid fa-check"></i> Precios guardados';
setTimeout(()=>document.getElementById("save-prices").innerHTML='<i class="fa-solid fa-floppy-disk"></i> Guardar precios',1800);
});
imageEditor.addEventListener("change", e => { const input=e.target.closest('input[type="file"]'); if(input) readProductImage(input.files[0],input.dataset.product,input.closest(".image-item").querySelector("img")); });
imageEditor.addEventListener("click", e => { const button=e.target.closest(".restore-image"); if(!button) return; delete pendingProductImages[button.dataset.product]; button.closest(".image-item").querySelector("img").src=defaultProductImages[button.dataset.product]; });
document.getElementById("save-images").addEventListener("click",() => { if(imagesLoading){ alert("Espera a que termine de procesarse la foto."); return; } try{ localStorage.setItem("imagenesVex",JSON.stringify(pendingProductImages)); }catch(error){ alert("No se pudieron guardar las fotos. Usa imágenes más pequeñas o elimina fotos anteriores."); return; } const button=document.getElementById("save-images"); button.innerHTML='<i class="fa-solid fa-check"></i> Fotos guardadas'; setTimeout(()=>button.innerHTML='<i class="fa-solid fa-images"></i> Guardar fotos',1800); });
document.getElementById("close-admin-map").addEventListener("click",closeDeliveryControl);
mapModal.addEventListener("click",e=>{if(e.target===mapModal)closeDeliveryControl();});
statusInput.addEventListener("change",()=>{adminMap.className=`admin-delivery-map status-${statusInput.value}`;});
document.getElementById("delivery-control-form").addEventListener("submit",e=>{
e.preventDefault(); const orders=getOrders(); const order=orders.find(item=>item.id===selectedOrderId); if(!order) return;
order.estadoEntrega=Number(statusInput.value); order.ubicacionRepartidor=locationInput.value.trim() || order.direccion;
localStorage.setItem("pedidos",JSON.stringify(orders)); closeDeliveryControl(); renderDashboard();
});
renderDashboard();
renderPriceEditor();
renderImageEditor();
