// https://stackoverflow.com/questions/28186349/chrome-extension-set-to-run-at-document-start-is-running-too-fast
document.addEventListener('DOMContentLoaded', fireContentLoadedEvent);

function fireContentLoadedEvent () {
    var path = chrome.runtime.getURL("iframed.html");
    var iframeMarkup = "<iframe id='iframed' src='" + path + "'></iframe>";
    
    $(iframeMarkup).prependTo("body");
    $("body").show(); // by default is display:none to avoid flashing content
}