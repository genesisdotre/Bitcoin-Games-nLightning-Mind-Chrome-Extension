console.log("I'm included in iframed.html, my name is iframed.js");

let intervalId;
let timeSeconds;

function timeIsUp() {
    window.top.postMessage('timeIsUp', '*');
    clearInterval(intervalId);
    $(".initial").hide();
    $(".failed").show();

    chrome.tabs.getCurrent(function(tab) {
        chrome.tabs.remove(tab.id, function() { });
    });
}

function formatTime(input) {
    let minutes = Math.floor(input / 60);
    let seconds = input % 60;
    function pad(num, size){ return ('000000000' + num).substr(-size); } // https://stackoverflow.com/a/2998822/775359
    return pad(minutes, 2) + ":" + pad(seconds, 2);
}

$("#form").on("submit", function(event) {

    let task = $("#task").val();
    timeSeconds = parseInt( $("#time-number").val() ) * 5; // DEBUG: minute has 5 seconds only for faster timeouts
    console.log("Task to accomplish: " + task + " in: " + timeSeconds + " seconds");


    intervalId = setInterval(function() {
        if (timeSeconds === 0) { timeIsUp(); }
        $("#timeLeft").text(formatTime(timeSeconds));
        timeSeconds--;
    }, 1000)

    window.top.postMessage('start', '*');

    event.preventDefault();
    return false;
});

let initialValue = 1; $("#time-range").val(initialValue); $("#time-number").val(initialValue);

$("#time-range").on("input", function() {
    $("#time-number").val( $(this).val() )
})
$("#time-number").on("input", function() {
    $("#time-range").val( $(this).val() )
})


// THIS DOES NOT WORK
// Error handling response: TypeError: Failed to construct 'URL': Invalid URL

// chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     console.log(tabs);
//     var tab = tabs[0];
//     var url = new URL(tab.url)
//     var domain = url.hostname
//     $("#thisSite").text(domain);
// })