$(document).ready(function () {
  const socket = io();

  socket.on("user count", (data) => {
    console.log(data);
  });
  // Form submittion with new message in field with id 'm'
  $("form").submit(function () {
    const messageToSend = $("#m").val();

    $("#m").val("");
    return false; // prevent form submit from refreshing page
  });
});
