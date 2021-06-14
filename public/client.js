$(document).ready(function () {
  const socket = io();

  socket.on("user count", (data) => {
    console.log(data);
  });
  socket.on("user", (data) => {
    $("#num-users").text(data.currentUsers + " users online");
    const message =
      data.name + data.connected
        ? " has joined the chat."
        : " has left the chat.";
    $("#messages").append($("<li>").html("<b>" + message + "</b>"));
  });
  // Form submittion with new message in field with id 'm'
  $("form").submit(function () {
    const messageToSend = $("#m").val();

    $("#m").val("");
    return false; // prevent form submit from refreshing page
  });
});
