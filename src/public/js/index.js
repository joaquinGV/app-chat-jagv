//Con este socket vamos a establerecer la comunicación con nuestro servidor
const socket = io();

// Swal.fire({
//     title: 'Saludos',
//     text: 'Mensaje inicial',
//     icon: 'success'
// });

let user;
const chatBox = document.getElementById("chatBox");
const messagesLog = document.getElementById("messageLogs");

// Vamos a desarrollar el modal de autenticación
Swal.fire({
  title: "Identificate",
  input: "text",
  text: "Ingresa el usuario para identificarte en el chat",
  inputValidator: (value) => {
    return (
      !value &&
      "Necesitas escribir un nombre de usuario para comenzar a chatear"
    );
  },
  allowOutsideClick: false,
  allowEscapeKey: false,
}).then((result) => {
  user = result.value;
  socket.emit("authenticated", user);
});

chatBox.addEventListener("keyup", (evt) => {
  if (evt.key === "Enter") {
    if (chatBox.value.trim().length > 0) {
      socket.emit("message", { user, message: chatBox.value });
      chatBox.value = "";
    }
  }
});

socket.on("messageLogs", (data) => {
  let messages = "";
  data.forEach((message) => {
    messages += `${message.user} dice: ${message.message}<br/>`;
  });
  messagesLog.innerHTML = messages;
});

socket.on("newUserConnect", (data) => {
  Swal.fire({
    toast: true,
    position: "top-end",
    showConfirmationButton: false,
    timer: 3000,
    title: `${data} se ha unido`,
    icon: "success",
  });
});
