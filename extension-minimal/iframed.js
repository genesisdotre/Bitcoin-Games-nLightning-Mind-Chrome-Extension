console.log("I'm included in iframed.html, my name is iframed.js");

$("#thisSite").text(location.href);

$("#form").on("submit", function(event) {

    let task = $("#task").val();
    console.log("Task to accomplish: " + task);

    event.preventDefault();
    return false;
});