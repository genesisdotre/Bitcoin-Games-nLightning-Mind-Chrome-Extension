// https://stackoverflow.com/questions/28186349/chrome-extension-set-to-run-at-document-start-is-running-too-fast
document.addEventListener('DOMContentLoaded', fireContentLoadedEvent);

function fireContentLoadedEvent () {
    if (ACTIVATE) {
        var path = chrome.runtime.getURL("iframed.html");
        var iframeMarkup = "<iframe id='iframed' src='" + path + "'></iframe>";
        
        $(iframeMarkup).prependTo("body");
    }

    $("body").addClass("focus-mind-chrome-extension-loaded");
}

window.onmessage = function(e){
    if (e.data == 'start') {
        document.getElementById("iframed").classList.add("collapsed");
    }
    if (e.data == 'timeIsUp') {
        document.getElementById("iframed").classList.remove("collapsed");
    }
};

// Native JavaScript implementation: https://developers.google.com/web/fundamentals/primers/promises
// Here we decide if the website is annoying or not
// This should resolve faster than DOMContentLoaded
// TODO: remove that dependency
var promise = new Promise(function(resolve, reject) {

    chrome.storage.sync.get('websites', function(data) {
        if (data && data.websites) {
            resolve(data.websites);
        }
        reject(data);
    });
  
});

let ACTIVATE = false;

promise.then(function(websites) {
    console.log("chrome.storage.sync --- location.href --- displaying YES or NO?", websites);

    for (let i=0; i<websites.length; i++) {
        if (websites[i].indexOf(location.host) !== -1) {
            ACTIVATE = true;

            return;
        }
    }

    if (location.host.indexOf("localhost") !== -1) ACTIVATE = true; // HACK FOR OFFLINE WORK

    console.log("NOT included")

  }, function(err) {
    console.log(err);
  });