const moment = require("moment");
function formatMessage(username, text, className, socketId) {
  return {
    username,
    text,
    time: moment().format("h:mm a"),
    className,
    socketId,
  };
}
module.exports = formatMessage;
