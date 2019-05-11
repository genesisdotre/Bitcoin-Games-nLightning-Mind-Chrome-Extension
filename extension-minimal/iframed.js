console.log("I'm included in iframed.html, my name is iframed.js");

$("#replace-me").text("I'm replaced from script");

$("#form").on("submit", function(event) {

    let task = $("#task").val();
    console.log("Task to accomplish: " + task);

    event.preventDefault();
    return false;
});