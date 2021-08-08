const codeGenerator = document.getElementById("create-room");
const codeDisplay = document.querySelector(".your-code");
const roomInput = document.getElementById("enter-room");
const code = [];
codeGenerator.addEventListener("click", () => {
  code.push(codeMaker());
  codeDisplay.innerText = `Copy and share to your friends: ${code[0]}`;
  setTimeout(() => {
    codeDisplay.innerText = "";
  }, 10000);
  roomInput.value = code[0];
});

function codeMaker() {
  let code = "";
  let alpha = "A1BC2DE3FG4HI5JK6LM7NO8PQ9RS1TUVWXYZ";
  for (var i = 0; i < 11; i++) {
    code += alpha.charAt(Math.floor(Math.random() * alpha.length));
  }
  return code;
}
