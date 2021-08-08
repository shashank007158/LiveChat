const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const formateMessage = require("./utils/messages");
const { userJoin, getUser, userLeave, getRoomUsers } = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));
const botName = "LiveChat";
//Run when client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    socket.emit(
      "message",
      formateMessage(botName, "Welcome to LiveChat", "default")
    );

    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formateMessage(
          botName,
          `${user.username} has joined the chat`,
          "default",
          socket.id
        )
      ); //Emits to other users except the one who connects
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  //Listening for chat message
  socket.on("chatMessage", (msg) => {
    const user = getUser(socket.id);
    const random = Math.floor(Math.round() * 2);
    io.to(user.room).emit(
      "message",
      formateMessage(user.username, msg, "", socket.id)
    );
  });
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formateMessage(botName, `${user.username} has left the chat`, "default")
      );
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});
const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
