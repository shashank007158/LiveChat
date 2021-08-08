const socket = io();
const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
let clientSocketId;
//Getting username and room from url using Qs
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

//joining chatroom
socket.emit("joinRoom", { username, room });

//Get Room and users
socket.on("roomUsers", ({ room, users }) => {
  console.log(room, users);
  outputRoomName(room);
  outputUsers(users);
});

socket.on("message", (message) => {
  console.log(message);
  outputMessage(message, clientSocketId);

  //scroll
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;
  clientSocketId = socket.id;
  socket.emit("chatMessage", msg);

  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

const outputMessage = (message, clientSocketId) => {
  if (clientSocketId === message.socketId && message.username !== "LiveChat") {
    message.className = "first";
  } else if (
    clientSocketId !== message.socketId &&
    message.username !== "LiveChat"
  ) {
    message.className = "last";
  }
  const div = document.createElement("div");
  div.classList.add("message");
  div.classList.add(`${message.className}`);
  console.log(message.className);
  div.innerHTML = ` <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>`;
  document.querySelector(".chat-messages").appendChild(div);
};

function outputRoomName(room) {
  roomName.innerText = room;
}
function outputUsers(users) {
  userList.innerHTML = `
  ${users.map((user) => `<li>${user.username}</li>`).join("")}
  `;
}
