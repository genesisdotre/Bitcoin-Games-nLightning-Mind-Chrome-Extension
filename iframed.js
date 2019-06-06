console.log("I'm included in iframed.html, my name is iframed.js");

let intervalId;
let timeSeconds;
const MINUTE = 5; // not 60 as non-DEBUG minute

function timeIsUp() {
    window.top.postMessage('timeIsUp', '*');
    clearInterval(intervalId);
    $(".screen").hide();
    $(".screen.failed").show();
}

$("#done").on("click", function() {
    _closeTab();
});

$("#closeTheTab").on("click", function() {
    _closeTab();
});

$("#addMinute").on("click", function() {
    timeSeconds = MINUTE;
    startCountdown();
});

function formatTime(input) {
    let minutes = Math.floor(input / 60);
    let seconds = input % 60;
    function pad(num, size){ return ('000000000' + num).substr(-size); } // https://stackoverflow.com/a/2998822/775359
    return pad(minutes, 2) + ":" + pad(seconds, 2);
}

$("#form").on("submit", function(event) {
    let task = $("#task").val();
    $("#workingOn").text(task); // copy past from the form into another screen

    timeSeconds = parseInt( $("#time-number").val() ) * MINUTE;
    console.log("Task to accomplish: " + task + " in: " + timeSeconds + " seconds");

    startCountdown();

    event.preventDefault();
    return false;
});

let initialValue = 10000; $("#time-range").val(initialValue); $("#time-number").val(initialValue);

$("#time-range").on("input", function() {
    $("#time-number").val( $(this).val() )
})
$("#time-number").on("input", function() {
    $("#time-range").val( $(this).val() )
})

function startCountdown() {
    $(".screen").hide();
    $(".screen.countdown").show();

    function countdown() {
        if (timeSeconds === 0) {
            timeIsUp();
        }
        $("#timeLeft").text(formatTime(timeSeconds));
        timeSeconds--;
    }
    countdown(); // calling it once immediately and then again in the setInterval
    intervalId = setInterval(countdown, 1000);
    window.top.postMessage('start', '*');
}

function _closeTab() {
    alert("closing tab works but for debugging I prefer to keep it open"); // IT REALLY WORKS
    // chrome.tabs.getCurrent(function(tab) {
    //     chrome.tabs.remove(tab.id, function() { });
    // });
}


chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    console.log(tabs);
    var tab = tabs[0];
    var url = new URL(tab.url)
    var domain = url.hostname
    $("#thisSite").text(domain);
})