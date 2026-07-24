const form = document.getElementById("registroForm");

form.addEventListener("submit",(e) => {
e.preventDefault();

const nombre = document.getElementById("nombre").value.trim();
const correo = document.getElementById("correo").value.trim();
const telefono = document.getElementById("telefono").value.trim();
const direccion = document.getElementById("direccion").value.trim();
const password = document.getElementById("password").value.trim();
const confirmar = document.getElementById("confirmar").value.trim();
const mensaje = document.getElementById("mensaje");

if(password !== confirmar){
mensaje.style.color = "red";
mensaje.innerHTML = "Las contraseñas no coinciden";
return;
}

const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
const existe = usuarios.find((usuario) => usuario.correo === correo);

if(existe){
mensaje.style.color = "red";
mensaje.innerHTML = "Ese correo ya está registrado";
return;
}

usuarios.push({
nombre,
correo,
telefono,
direccion,
password
});

localStorage.setItem("usuarios",JSON.stringify(usuarios));

mensaje.style.color = "#00ff66";
mensaje.innerHTML = "Registro realizado correctamente";

setTimeout(() => {
window.location = "login.html";
},1600);
});
