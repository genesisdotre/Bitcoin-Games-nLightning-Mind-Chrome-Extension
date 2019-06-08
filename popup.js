let websites = [];

// INIT INIT INIT INIT INIT INIT
let prom1 = new Promise(function(resolve, reject) {
  chrome.storage.sync.get('websites', function(data) {
    if(data && data.websites) {
      websites = data.websites;
    } else {
      websites = defaultWebsites; // initially when there is nothing there
    }
    resolve(websites);
  });
});

let prom2 = new Promise(function(resolve, reject) {
  chrome.storage.sync.get('satoshis', function(data) {
    if(data && data.satoshis) {
      satoshisPerSecond = data.satoshis;
    } else {
      satoshisPerSecond = 3;
    }
    resolve(satoshisPerSecond);

    $("#sat-range").val(satoshisPerSecond);
    $("#sat-number").val(satoshisPerSecond);
  });
});
let prom3 = new Promise(function(resolve, reject) {
  $.get("https://api.coindesk.com/v1/bpi/currentprice.json", function(response) {
    let BTCUSD = JSON.parse(response).bpi.USD.rate_float;
    price1sat = BTCUSD / 100000000;
    resolve(price1sat);

    // Satoshis are limited between 1 and 1000. USD has max slider value depending on price.
    let maxPerHour = Math.ceil(1000 * price1sat * 3600);
    $("#dol-number").attr("max", maxPerHour);
    $("#dol-range").attr("max", maxPerHour);
  })
});

Promise.all([prom1, prom2, prom3]).then(function(values) {
  websitesMarkup();
  updateSliders();
});

function websitesMarkup() {
  if (websites.length > 0) {
    let markup = "";
    websites.forEach(function(website) {
      markup += "<div class='website'><span class='url'>" + website + "</span><span class='x'>❌</span></div>";
    });
    $("#websites").html(markup);
  } else {
    $("#websites").html("Nothing saved.");
  }
}

function saveStorage() {
  return chrome.storage.sync.set({ websites: websites }, function() {
    console.log("storage updated websites", websites);
  });
}

$("#add").on("submit", function(event) {
  let val = $("#url").val(); $("#url").val("")

  websites.push(val);

  saveStorage();
  websitesMarkup();

  event.preventDefault();
  return false;
})

$("#resetDefault").on("click", function() {
  websites = defaultWebsites;
  saveStorage();
  websitesMarkup();
})

$("#deleteAll").on("click", function() {
  websites = [];
  saveStorage();
  websitesMarkup();
})

let defaultWebsites = [
  "facebook.com",
  "twitter.com",
  "instagram.com",
  "reddit.com",
  "news.ycombinator.com",
  "9gag.com",
  "coinmarketcap.com",
  "bitmex.com",
  "marsrobertson.com"
];

$("#websites").on("click", ".x", function() {
  let index = websites.indexOf($(this).prev().text());
  websites.splice(index, 1);
  saveStorage();
  websitesMarkup();
})







// SLIDERS SLIDERS SLIDERS SLIDERS
let satoshisPerSecond;
let dollarsPerHour;
let price1sat;

function updateSliders(satoshis) {
  if (satoshis === false) { // option when it was dollars per hour that changed, otherwise default satoshis per second
    satoshisPerSecond = Math.min(1000, Math.floor((dollarsPerHour / 3600) / price1sat)); // don't want to have 1001 or 1002 it looks weird
    $("#sat-number").val(satoshisPerSecond);
    $("#sat-range").val(satoshisPerSecond);
  } else {
    dollarsPerHour = Math.ceil(satoshisPerSecond * 3600 * price1sat);
    $("#dol-number").val(dollarsPerHour);
    $("#dol-range").val(dollarsPerHour);
  }

  chrome.runtime.sendMessage({satoshis: satoshisPerSecond}, function(response) {
    console.log("send satoshisPerSecond to the host page that runs iframed.js");
  });

  return chrome.storage.sync.set({ satoshis: satoshisPerSecond }, function() {
    console.log("storage updated, satoshisPerSecond: " + satoshisPerSecond);
  });  
}

$("#sat-range").on("input", function() {
  $("#sat-number").val( $(this).val() )
  satoshisPerSecond = $(this).val();
  updateSliders();
})
$("#sat-number").on("input", function() {
  $("#sat-range").val( $(this).val() )
  satoshisPerSecond = $(this).val();
  updateSliders();
})
$("#dol-range").on("input", function() {
  $("#dol-number").val( $(this).val() )
  dollarsPerHour = $(this).val();
  updateSliders(false);
})
$("#dol-number").on("input", function() {
  $("#dol-range").val( $(this).val() )
  dollarsPerHour = $(this).val();
  updateSliders(false);
})






// NAVIGATION
$(".nav").on("click", ".tab", function() {

  $(".page").removeClass("active");
  $("." + $(this).data("tab")).addClass("active");
})







// DRAG AND DROP
// https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/
let dropArea = document.getElementById("drop-area")

// Prevent default drag behaviors
;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false)   
  document.body.addEventListener(eventName, preventDefaults, false)
})

// Highlight drop area when item is dragged over it
;['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false)
})

;['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false)
})

// Handle dropped files
dropArea.addEventListener('drop', handleDrop, false)

function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}

function highlight(e) {
  dropArea.classList.add('highlight')
}

function unhighlight(e) {
  dropArea.classList.remove('highlight')
}

// https://stackoverflow.com/questions/40031688/javascript-arraybuffer-to-hex
function buf2hex(buffer) { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

$("#macaroon").on("change", handleDrop);

function handleDrop(e) {
  let file;
  if (e.type === "change") {
    file = e.target.files[0]
  } else if (e.type === "drop") {
    file = e.dataTransfer.files[0]; 
  }
  
  if (file) {
    let fileReader = new FileReader();
    fileReader.onload = function(e) {
      let macaroon = buf2hex(e.target.result);
      $("#macaroon-textarea").val(macaroon);
      chrome.storage.sync.set({ macaroon: macaroon }, function() {
        console.log("storage updated macaroon", macaroon);
      });
    };
    fileReader.readAsArrayBuffer(file);
  }
}

// This is only for presentation purposes
// Actual work happens in `iframed.js`
chrome.storage.sync.get("macaroon", function(data) {
  if(data && data.macaroon) {
      $("#macaroon-textarea").val(data.macaroon);
  }
});