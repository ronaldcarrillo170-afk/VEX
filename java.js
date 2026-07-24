const cartButton = document.getElementById("open-cart");
const closeCartButton = document.getElementById("close-cart");
const cartPanel = document.getElementById("cart-panel");
const cartOverlay = document.getElementById("cart-overlay");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutForm = document.getElementById("checkout-form");
const ordersList = document.getElementById("orders-list");
const favoritesList = document.getElementById("favorites-list");
const profileInfo = document.getElementById("profile-info");
const guestActions = document.getElementById("guest-actions");
const logoutButton = document.getElementById("logout-btn");
const adminDashboardLink = document.getElementById("admin-dashboard-link");
const loginLink = document.getElementById("login-link");
const exploreButton = document.getElementById("explorar");
const showAllProductsLink = document.getElementById("show-all-products");
const productsSection = document.getElementById("productos");
const productsTitle = document.getElementById("products-title");
const cursor = document.querySelector(".cursor");
const imageModal = document.getElementById("image-modal");
const modalProductImg = document.getElementById("modal-product-img");
const modalProductName = document.getElementById("modal-product-name");
const modalProductDescription = document.getElementById("modal-product-description");
const closeImageModal = document.getElementById("close-image-modal");
const zoomInButton = document.getElementById("zoom-in");
const zoomOutButton = document.getElementById("zoom-out");
const zoomResetButton = document.getElementById("zoom-reset");
const paymentHelp = document.getElementById("payment-help");
const trackingModal = document.getElementById("tracking-modal");
const closeTrackingButton = document.getElementById("close-tracking");
const trackingTitle = document.getElementById("tracking-title");
const trackingSubtitle = document.getElementById("tracking-subtitle");
const trackingSteps = document.getElementById("tracking-steps");
const deliveryMap = document.getElementById("delivery-map");
const cartCount = document.createElement("span");

// NavegaciÃ³n accesible para pantallas tÃ¡ctiles y pequeÃ±as.
const mainNav = document.querySelector("nav");
const navList = mainNav?.querySelector("ul");
if (mainNav && navList) {
const menuToggle = document.createElement("button");
menuToggle.type = "button";
menuToggle.className = "menu-toggle";
menuToggle.setAttribute("aria-label", "Abrir menÃº de navegaciÃ³n");
menuToggle.setAttribute("aria-expanded", "false");
menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
mainNav.insertBefore(menuToggle, navList);

const closeMenu = () => {
  mainNav.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menÃº de navegaciÃ³n");
  menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
};

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menÃº de navegaciÃ³n" : "Abrir menÃº de navegaciÃ³n");
  menuToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
});

navList.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
window.addEventListener("resize", () => { if (window.innerWidth > 760) closeMenu(); });
}

cartCount.className = "cart-count";
cartButton.parentElement.appendChild(cartCount);

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
let usuarioActual = JSON.parse(localStorage.getItem("usuarioActual")) || null;
let zoomActual = 1;
let imageHoverActive = false;

const productDescriptions = {
"Hoodie VEX":"Hoodie de presencia urbana, cómodo y listo para destacar.","Gorra VEX":"Un accesorio ligero que le da carácter a cualquier look.","Camiseta VEX":"Esencial de la colección VEX con estilo relajado.","Outfit VEX":"Una combinación pensada para un look completo y atrevido.","Caja Dulce":"Selección dulce para regalar, compartir o darte un gusto.","Combo Premium":"Una experiencia VEX llena de favoritos premium.","Mix de Gomitas":"Gomitas variadas con color, sabor y mucha actitud.","Pack Chocolates":"Chocolate para disfrutar cada momento con un toque especial.","Hoodie Midnight":"Diseño oscuro, moderno y cómodo para todos los días.","Camiseta Oversize":"Silueta amplia y urbana para un estilo sin esfuerzo.","Jogger Urban":"Comodidad y movimiento para llevar tu estilo a cualquier lugar.","Chaqueta Varsity":"Una chaqueta llamativa inspirada en el estilo universitario.","Gorra Shadow":"Una gorra versátil con una vibra sobria y moderna.","Tote Bag VEX":"Práctica, ligera y perfecta para acompañarte a diario.","Brownie Intenso":"Sabor profundo de chocolate para los amantes de lo dulce.","Kit Cine Dulce":"El acompañante ideal para una tarde de películas.","Trufas VEX":"Bocados delicados de chocolate para disfrutar despacio.","Gomitas Ácidas":"Una mezcla intensa y divertida con el toque ácido justo.","Snack Box VEX":"Una caja de snacks lista para sorprender.","Mini Dulces Mix":"Pequeños dulces, grandes antojos."
};

const formatoPrecio = new Intl.NumberFormat("es-CO", {
style:"currency",
currency:"COP",
maximumFractionDigits:0
});

function guardarCarrito(){
localStorage.setItem("carrito",JSON.stringify(carrito));
}

function guardarFavoritos(){
localStorage.setItem("favoritos",JSON.stringify(favoritos));
}

function abrirCarrito(){
cartPanel.classList.remove("hidden");
cartOverlay.classList.remove("hidden");
}

function cerrarCarrito(){
cartPanel.classList.add("hidden");
cartOverlay.classList.add("hidden");
}

function obtenerPrecio(texto){
return Number(texto.replace(/[^0-9]/g,""));
}

function obtenerProductoDesdeCard(card){
return {
nombre:card.querySelector("h3").textContent.trim(),
precio:obtenerPrecio(card.querySelector("span").textContent),
imagen:card.querySelector("img").getAttribute("src")
};
}

function aplicarPreciosPersonalizados(){
const precios = JSON.parse(localStorage.getItem("preciosVex")) || {};
document.querySelectorAll(".product-card").forEach((card) => {
const nombre = card.querySelector("h3").textContent.trim();
if(!precios[nombre]) return;
card.querySelector("span").textContent = formatoPrecio.format(precios[nombre]);
});
}
function aplicarImagenesPersonalizadas(){
const imagenes = JSON.parse(localStorage.getItem("imagenesVex")) || {};
document.querySelectorAll(".product-card").forEach((card) => { const nombre=card.querySelector("h3").textContent.trim(); const image=card.querySelector(".product-img"); if(imagenes[nombre]){ image.setAttribute("src",imagenes[nombre]); animarCambioImagen(image); } });
}

function animarCambioImagen(image){
image.classList.remove("image-changing"); void image.offsetWidth; image.classList.add("image-changing");
image.addEventListener("animationend",() => image.classList.remove("image-changing"),{once:true});
}

function decorarImagenesProducto(){
document.querySelectorAll(".product-img").forEach((image) => {
if(image.parentElement.classList.contains("image-frame")) return;
const frame = document.createElement("div"); frame.className = "image-frame";
image.parentNode.insertBefore(frame,image); frame.appendChild(image);
});
}

function aplicarZoom(){
const scale = imageHoverActive ? Math.max(zoomActual,1.48) : zoomActual;
modalProductImg.style.transform = `scale(${scale})`;
}

function cambiarZoom(cantidad){
zoomActual = Math.min(5,Math.max(1,zoomActual + cantidad));
aplicarZoom();
}

function resetearZoom(){
zoomActual = 1;
aplicarZoom();
}

function abrirImagenProducto(img){
const card = img.closest(".product-card");
const nombre = card.querySelector("h3").textContent.trim();

modalProductImg.src = img.src;
modalProductImg.alt = img.alt;
modalProductName.textContent = nombre;
modalProductDescription.textContent = productDescriptions[nombre] || "Un producto exclusivo de la colección VEX.";
animarCambioImagen(modalProductImg);
resetearZoom();
imageModal.classList.remove("hidden");
}

function cerrarImagenProducto(){
imageModal.classList.add("hidden");
}

function renderCarrito(){
cartItems.innerHTML = "";
const totalCantidad = carrito.reduce((suma,producto) => suma + producto.cantidad,0);

cartCount.textContent = totalCantidad;
cartCount.classList.toggle("hidden",totalCantidad === 0);

if(carrito.length === 0){
cartItems.innerHTML = `
<div class="empty-cart">
<i class="fa-solid fa-cart-shopping"></i>
<h4>Tu carrito está vacío</h4>
<p>Agrega productos destacados para preparar tu pedido.</p>
</div>
`;
cartTotal.innerHTML = `
<div class="total-row">
<span>Total</span>
<strong>${formatoPrecio.format(0)}</strong>
</div>
`;
return;
}

carrito.forEach((producto,index) => {
const item = document.createElement("div");
item.className = "cart-item";

item.innerHTML = `
<div class="cart-thumb">
<img src="${producto.imagen}" alt="${producto.nombre}" onerror="this.src='img/logo.png'">
</div>
<div class="meta">
<div class="cart-info">
<h4>${producto.nombre}</h4>
<p>${formatoPrecio.format(producto.precio)}</p>
</div>
<div class="quantity">
<button type="button" data-action="minus" data-index="${index}">
<i class="fa-solid fa-minus"></i>
</button>
<span>${producto.cantidad}</span>
<button type="button" data-action="plus" data-index="${index}">
<i class="fa-solid fa-plus"></i>
</button>
</div>
</div>
<button type="button" class="remove" data-action="remove" data-index="${index}" aria-label="Eliminar producto">
<i class="fa-solid fa-trash"></i>
</button>
`;

cartItems.appendChild(item);
});

const total = carrito.reduce((suma,producto) => suma + producto.precio * producto.cantidad,0);

cartTotal.innerHTML = `
<div class="total-row">
<span>Total</span>
<strong>${formatoPrecio.format(total)}</strong>
</div>
`;
}

function renderPerfil(){
if(!usuarioActual){
profileInfo.innerHTML = `
<span>Invitado</span>
<h3>Inicia sesión o crea tu cuenta</h3>
<p>Guarda tus datos, revisa tus pedidos y conserva tus favoritos en VEX Store.</p>
`;
guestActions.classList.remove("hidden");
logoutButton.classList.add("hidden");
adminDashboardLink.classList.add("hidden");
loginLink.href = "login.html";
return;
}

profileInfo.innerHTML = `
<span>${localStorage.getItem("usuario") === "admin" ? "Administrador VEX" : "Cliente VEX"}</span>
<h3>${usuarioActual.nombre}</h3>
<p><strong>Correo:</strong> ${usuarioActual.correo}</p>
<p><strong>Teléfono:</strong> ${usuarioActual.telefono || "No registrado"}</p>
<p><strong>Dirección:</strong> ${usuarioActual.direccion || "No registrada"}</p>
`;

guestActions.classList.add("hidden");
logoutButton.classList.remove("hidden");
adminDashboardLink.classList.toggle("hidden",localStorage.getItem("usuario") !== "admin");
loginLink.href = "#cuenta";
}

function renderPedidos(){
ordersList.innerHTML = "";

if(pedidos.length === 0){
ordersList.innerHTML = `<p class="empty-orders">Aún no tienes pedidos ni compras.</p>`;
return;
}

pedidos.forEach((pedido) => {
const order = document.createElement("div");
order.className = "order-card";
const seguimiento = obtenerSeguimiento(pedido);

order.innerHTML = `
<div class="order-top"><h3>Pedido #${pedido.id}</h3><span class="order-status status-${seguimiento.paso}">${seguimiento.estado}</span></div>
<p><strong>Cliente:</strong> ${pedido.nombre}</p>
<p><strong>Dirección:</strong> ${pedido.direccion}</p>
<p><strong>Entrega:</strong> ${pedido.fecha}</p>
<p><strong>Pago:</strong> ${pedido.metodoPago || "No especificado"}</p>
<p><strong>Total:</strong> ${formatoPrecio.format(pedido.total)}</p>
<p><strong>Productos:</strong> ${pedido.productos.map((p) => `${p.nombre} x${p.cantidad}`).join(", ")}</p>
<button class="track-order-btn" type="button" data-order-id="${pedido.id}"><i class="fa-solid fa-map-location-dot"></i> Ver mapa y seguimiento</button>
`;

ordersList.appendChild(order);
});
}

function obtenerSeguimiento(pedido){
const paso = Number.isInteger(pedido.estadoEntrega) ? pedido.estadoEntrega : 0;
const estados = ["Pedido confirmado","Preparando pedido","Repartidor en camino","Pedido entregado"];
return { paso, estado:estados[paso] };
}

function abrirSeguimiento(pedido){
const seguimiento = obtenerSeguimiento(pedido);
const textos = [
"Recibimos tu compra y validamos el pago.",
"Estamos preparando tus productos para envío.",
"Tu repartidor ya salió hacia tu dirección.",
"Tu pedido fue entregado. ¡Disfrútalo!"
];
const etapas = ["Pedido confirmado","En preparación","En camino","Entregado"];
trackingTitle.textContent = seguimiento.estado;
trackingSubtitle.textContent = `Pedido #${pedido.id} · ${pedido.ubicacionRepartidor || pedido.direccion}`;
document.querySelector(".home-label").innerHTML = `<i class="fa-solid fa-house"></i> ${pedido.ubicacionRepartidor || "Tu dirección"}`;
deliveryMap.className = `delivery-map status-${seguimiento.paso}`;
trackingSteps.innerHTML = etapas.map((etapa,index) => `
<div class="tracking-step ${index <= seguimiento.paso ? "done" : ""} ${index === seguimiento.paso ? "current" : ""}">
<span><i class="fa-solid ${index === 0 ? "fa-receipt" : index === 1 ? "fa-box" : index === 2 ? "fa-motorcycle" : "fa-circle-check"}"></i></span>
<div><strong>${etapa}</strong>${index === seguimiento.paso ? `<small>${textos[index]}</small>` : ""}</div>
</div>`).join("");
trackingModal.classList.remove("hidden");
}

function cerrarSeguimiento(){ trackingModal.classList.add("hidden"); }

function renderFavoritos(){
favoritesList.innerHTML = "";

document.querySelectorAll(".favorite-btn").forEach((button) => {
const producto = obtenerProductoDesdeCard(button.closest(".product-card"));
const activo = favoritos.some((favorito) => favorito.nombre === producto.nombre);
button.classList.toggle("active",activo);
button.innerHTML = activo ? `<i class="fa-solid fa-heart"></i>` : `<i class="fa-regular fa-heart"></i>`;
});

if(favoritos.length === 0){
favoritesList.innerHTML = `<p class="empty-orders">No tienes favoritos guardados.</p>`;
return;
}

favoritos.forEach((producto,index) => {
const item = document.createElement("div");
item.className = "favorite-item";

item.innerHTML = `
<img src="${producto.imagen}" alt="${producto.nombre}" onerror="this.src='img/logo.png'">
<div>
<h4>${producto.nombre}</h4>
<p>${formatoPrecio.format(producto.precio)}</p>
</div>
<button type="button" data-index="${index}" aria-label="Quitar favorito">
<i class="fa-solid fa-trash"></i>
</button>
`;

favoritesList.appendChild(item);
});
}

function filtrarProductos(categoria){
const titulos = {
ropa:"Ropa VEX",
dulceria:"Dulces VEX",
todos:"Productos Destacados"
};

productsSection.classList.remove("catalog-hidden");

document.querySelectorAll(".product-card").forEach((card,index) => {
const mostrar = categoria === "todos" || card.dataset.category === categoria;
card.classList.toggle("hidden",!mostrar);

if(mostrar){
card.classList.remove("product-enter");
card.style.animationDelay = `${index * 90}ms`;
void card.offsetWidth;
card.classList.add("product-enter");
}
});

productsTitle.textContent = titulos[categoria] || titulos.todos;

productsSection.scrollIntoView({
behavior:"smooth"
});
}

document.querySelectorAll(".add-cart").forEach((button) => {
button.addEventListener("click",() => {
const producto = obtenerProductoDesdeCard(button.closest(".product-card"));
const existe = carrito.find((item) => item.nombre === producto.nombre);

if(existe){
existe.cantidad++;
}else{
carrito.push({
...producto,
cantidad:1
});
}

guardarCarrito();
renderCarrito();
abrirCarrito();
});
});

document.querySelectorAll(".favorite-btn").forEach((button) => {
button.addEventListener("click",() => {
const producto = obtenerProductoDesdeCard(button.closest(".product-card"));
const existe = favoritos.findIndex((favorito) => favorito.nombre === producto.nombre);

if(existe >= 0){
favoritos.splice(existe,1);
}else{
favoritos.unshift(producto);
}

guardarFavoritos();
renderFavoritos();
});
});

document.querySelectorAll(".category-filter").forEach((button) => {
button.addEventListener("click",() => {
filtrarProductos(button.dataset.filter);
});
});

document.querySelectorAll(".category-card").forEach((card) => {
card.addEventListener("mousemove",(e) => {
if(window.matchMedia("(pointer: coarse)").matches) return;
const box = card.getBoundingClientRect();
card.style.setProperty("--pointer-x", `${((e.clientX - box.left) / box.width) * 100}%`);
card.style.setProperty("--pointer-y", `${((e.clientY - box.top) / box.height) * 100}%`);
});
});

favoritesList.addEventListener("click",(e) => {
const button = e.target.closest("button[data-index]");

if(!button) return;

favoritos.splice(Number(button.dataset.index),1);
guardarFavoritos();
renderFavoritos();
});

document.querySelectorAll(".product-img").forEach((img) => {
img.addEventListener("click",() => {
abrirImagenProducto(img);
});

document.querySelectorAll(".product-card").forEach((card) => {
card.addEventListener("mousemove",(e) => {
if(window.matchMedia("(pointer: coarse)").matches) return;
const box = card.getBoundingClientRect();
const tiltX = ((e.clientY - box.top) / box.height - .5) * -5;
const tiltY = ((e.clientX - box.left) / box.width - .5) * 5;
card.style.setProperty("--tilt-x", `${tiltX}deg`);
card.style.setProperty("--tilt-y", `${tiltY}deg`);
});
card.addEventListener("mouseleave",() => {
card.style.setProperty("--tilt-x","0deg");
card.style.setProperty("--tilt-y","0deg");
});
});
});

cartItems.addEventListener("click",(e) => {
const button = e.target.closest("button[data-action]");

if(!button) return;

const action = button.dataset.action;
const index = Number(button.dataset.index);

if(!action || Number.isNaN(index)) return;

if(action === "plus"){
carrito[index].cantidad++;
}

if(action === "minus"){
carrito[index].cantidad--;

if(carrito[index].cantidad <= 0){
carrito.splice(index,1);
}
}

if(action === "remove"){
carrito.splice(index,1);
}

guardarCarrito();
renderCarrito();
});

checkoutForm.addEventListener("submit",(e) => {
e.preventDefault();

if(carrito.length === 0){
alert("Agrega productos antes de realizar el pedido.");
return;
}

const nombre = document.getElementById("customer-name").value.trim();
const direccion = document.getElementById("customer-address").value.trim();
const fecha = document.getElementById("delivery-date").value;
const metodoPago = document.querySelector('input[name="payment-method"]:checked').value;
const total = carrito.reduce((suma,producto) => suma + producto.precio * producto.cantidad,0);

const pedido = {
id:Date.now(),
creadoEn:Date.now(),
correo:usuarioActual ? usuarioActual.correo : "Invitado",
nombre,
direccion,
fecha,
total,
metodoPago,
productos:[...carrito]
};

pedidos.unshift(pedido);
localStorage.setItem("pedidos",JSON.stringify(pedidos));

carrito = [];
guardarCarrito();
checkoutForm.reset();
renderCarrito();
renderPedidos();
cerrarCarrito();

alert(`Pago simulado con ${metodoPago} aprobado. ¡Tu pedido fue realizado correctamente!`);
});

document.querySelectorAll('input[name="payment-method"]').forEach((input) => {
input.addEventListener("change",() => {
document.querySelectorAll(".payment-option").forEach((option) => {
option.classList.toggle("selected", option.querySelector("input").checked);
});

const mensajes = {
Nequi:"Serás dirigido a Nequi para confirmar tu pago.",
Daviplata:"Confirma el pago desde tu cuenta Daviplata.",
Tarjeta:"Ingresa tus datos de tarjeta en la pasarela segura.",
PSE:"Serás dirigido a tu banco para aprobar la transferencia."
};
paymentHelp.innerHTML = `<i class="fa-solid fa-shield-halved"></i> ${mensajes[input.value]}`;
});
});

ordersList.addEventListener("click",(e) => {
const button = e.target.closest(".track-order-btn");
if(!button) return;
const pedido = pedidos.find((item) => String(item.id) === button.dataset.orderId);
if(pedido) abrirSeguimiento(pedido);
});

closeTrackingButton.addEventListener("click",cerrarSeguimiento);
trackingModal.addEventListener("click",(e) => { if(e.target === trackingModal) cerrarSeguimiento(); });

logoutButton.addEventListener("click",() => {
localStorage.removeItem("usuario");
localStorage.removeItem("usuarioActual");
usuarioActual = null;
renderPerfil();
});

cartButton.addEventListener("click",abrirCarrito);
closeCartButton.addEventListener("click",cerrarCarrito);
cartOverlay.addEventListener("click",cerrarCarrito);
closeImageModal.addEventListener("click",cerrarImagenProducto);
zoomInButton.addEventListener("click",() => cambiarZoom(.5));
zoomOutButton.addEventListener("click",() => cambiarZoom(-.5));
zoomResetButton.addEventListener("click",resetearZoom);

modalProductImg.addEventListener("wheel",(e) => {
e.preventDefault();

if(e.deltaY < 0){
cambiarZoom(.35);
}else{
cambiarZoom(-.35);
}
});

modalProductImg.addEventListener("mouseenter",() => { imageHoverActive=true; modalProductImg.classList.add("following-mouse"); aplicarZoom(); });
modalProductImg.addEventListener("mousemove",(e) => {
const box=modalProductImg.getBoundingClientRect(); const x=((e.clientX-box.left)/box.width)*100; const y=((e.clientY-box.top)/box.height)*100;
modalProductImg.style.transformOrigin=`${x}% ${y}%`;
});
modalProductImg.addEventListener("mouseleave",() => { imageHoverActive=false; modalProductImg.classList.remove("following-mouse"); modalProductImg.style.transformOrigin="center"; aplicarZoom(); });

imageModal.addEventListener("click",(e) => {
if(e.target === imageModal){
cerrarImagenProducto();
}
});

document.addEventListener("keydown",(e) => {
if(e.key === "Escape"){
cerrarImagenProducto();
cerrarSeguimiento();
}
});

exploreButton.addEventListener("click",() => {
filtrarProductos("todos");
});

showAllProductsLink.addEventListener("click",() => {
filtrarProductos("todos");
});

document.addEventListener("mousemove",(e) => {
if(!cursor) return;
cursor.style.left = `${e.clientX}px`;
cursor.style.top = `${e.clientY}px`;
});

document.addEventListener("mousedown",() => cursor?.classList.add("cursor-click"));
document.addEventListener("mouseup",() => cursor?.classList.remove("cursor-click"));

if(usuarioActual){
document.getElementById("customer-name").value = usuarioActual.nombre || "";
document.getElementById("customer-address").value = usuarioActual.direccion || "";
}

renderCarrito();
renderPerfil();
renderPedidos();
renderFavoritos();
aplicarPreciosPersonalizados();
aplicarImagenesPersonalizadas();
decorarImagenesProducto();
window.addEventListener("storage",(event) => { if(event.key === "imagenesVex") aplicarImagenesPersonalizadas(); });
setInterval(renderPedidos,5000);
