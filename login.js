const cliente = {
nombre:"Ronald Carrillo",
correo:"ronaldcarrillo170@gmail.com",
password:"1033106268",
telefono:"No registrado",
direccion:"No registrada"
};

const admin = {
nombre:"Administrador VEX",
correo:"admin@vex.com",
password:"1033106268",
telefono:"Soporte VEX",
direccion:"Panel administrativo"
};

const form = document.getElementById("loginForm");
const mensaje = document.getElementById("mensaje");
const mostrar = document.getElementById("mostrar");
const pass = document.getElementById("password");

mostrar.onclick = () => {
if(pass.type === "password"){
pass.type = "text";
mostrar.className = "fa-solid fa-eye-slash";
}else{
pass.type = "password";
mostrar.className = "fa-solid fa-eye";
}
};

window.onload = () => {
const correo = localStorage.getItem("correo");

if(correo){
document.getElementById("correo").value = correo;
document.getElementById("recordar").checked = true;
}
};

function iniciarSesion(usuario,tipo){
localStorage.setItem("usuario",tipo);
localStorage.setItem("usuarioActual",JSON.stringify(usuario));
}

form.addEventListener("submit",(e) => {
e.preventDefault();

const correo = document.getElementById("correo").value.trim();
const password = document.getElementById("password").value.trim();

if(document.getElementById("recordar").checked){
localStorage.setItem("correo",correo);
}else{
localStorage.removeItem("correo");
}

if(correo === admin.correo && password === admin.password){
iniciarSesion(admin,"admin");
mensaje.style.color = "#00ff7b";
mensaje.innerHTML = "Bienvenido Administrador";

setTimeout(() => {
window.location = "admin.html";
},1200);

return;
}

if(correo === cliente.correo && password === cliente.password){
iniciarSesion(cliente,"cliente");
mensaje.style.color = "#00ff7b";
mensaje.innerHTML = "Bienvenido Ronald";

setTimeout(() => {
window.location = "index.html";
},1200);

return;
}

const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
const usuarioRegistrado = usuarios.find((usuario) => {
return usuario.correo === correo && usuario.password === password;
});

if(usuarioRegistrado){
iniciarSesion(usuarioRegistrado,"cliente");
mensaje.style.color = "#00ff7b";
mensaje.innerHTML = `Bienvenido ${usuarioRegistrado.nombre}`;

setTimeout(() => {
window.location = "index.html";
},1200);

return;
}

mensaje.style.color = "red";
mensaje.innerHTML = "Correo o contraseña incorrectos";
});
