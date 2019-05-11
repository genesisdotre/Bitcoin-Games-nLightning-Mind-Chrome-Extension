console.log("I'm included in iframed.html, my name is iframed.js");

$("#thisSite").text(location.href);

$("#form").on("submit", function(event) {

    let task = $("#task").val();
    console.log("Task to accomplish: " + task);

    event.preventDefault();
    return false;
});

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var tab = tabs[0];
    var url = new URL(tab.url)
    var domain = url.hostname
    $("#thisSite").text(domain);
})