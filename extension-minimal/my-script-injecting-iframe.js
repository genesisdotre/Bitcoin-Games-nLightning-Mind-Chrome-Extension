// https://stackoverflow.com/questions/28186349/chrome-extension-set-to-run-at-document-start-is-running-too-fast
document.addEventListener('DOMContentLoaded', fireContentLoadedEvent);

function fireContentLoadedEvent () {
    var path = chrome.runtime.getURL("iframed.html");
    var iframeMarkup = "<iframe id='iframed' src='" + path + "'></iframe>";
    
    $(iframeMarkup).prependTo("body");
    $("body").show(); // by default is display:none to avoid flashing content
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
var promise = new Promise(function(resolve, reject) {

    chrome.storage.sync.get('websites', function(data) {

        if (data && data.websites) {
            for (let i=0; i<data.websites.length; i++) {
                if (data.websites[i].indexOf(location.host) !== -1) {
                    resolve(true);
                }
            }
        }
        resolve(false);
    });
  
});

promise.then(function(result) {
    console.log("chrome.storage.sync --- location.href --- displaying YES or NO?");

    if (result === true) {
        console.log("INCLUDED")
    } else {
        console.log("NOT included")
    }
  }, function(err) {
    console.log(err); // Error: "It broke"
  });