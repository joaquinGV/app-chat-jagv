import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import { Server } from "socket.io";
import viewsRouter from "./routes/views.router.js";

const app = express();

//Servidor archivos estáticos
app.use(express.static(`${__dirname}/public`));

//Motor de plantillas
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

//Routes
app.use("/", viewsRouter);

const server = app.listen(8080, () => console.log("Server running"));

//Socket io
const socketServer = new Server(server);

const messages = [];

socketServer.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("message", (data) => {
    messages.push(data);
    socketServer.emit("messageLogs", messages);
  });

  socket.on("authenticated", (data) => {
    //Enviamos todos los mensajes almacenados hasta el momento
    // solo al cliente que se acaba de conectar
    socket.emit("messageLogs", messages);
    socket.broadcast.emit("newUserConnect", data);
  });
});
