let websites = [];

// INIT INIT INIT INIT INIT INIT
chrome.storage.sync.get('websites', function(data) {
  if(data && data.websites) {
    websites = data.websites;
  }
  websitesMarkup();
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
    console.log("storage updated");
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

$("#macaroon").on("change", function(event) {
  var file = event.target.files[0]; 
  if (file){
    var fileReader = new FileReader();
    fileReader.onload = function(e) {
      var binaryString = e.target.result;



    };
    fileReader.readAsBinaryString(file);
  }
});


let macaroon = "0201036c6e6402cf01030a1054a03ffe820ed30ff7301b5b7645e6a21201301a160a0761646472657373120472656164120577726974651a130a04696e666f120472656164120577726974651a170a08696e766f69636573120472656164120577726974651a160a076d657373616765120472656164120577726974651a170a086f6666636861696e120472656164120577726974651a160a076f6e636861696e120472656164120577726974651a140a057065657273120472656164120577726974651a120a067369676e6572120867656e6572617465000006206fbbce082e4ed2359d5eb9cbf87d2365d4388394a4022db180c51e8eac2d3a5d";


$("#pay").on("click", function() {
  let lnInvoice = $("#invoice").val();

  var requestBody = { 
    payment_request: lnInvoice,
  };
  
  $.ajax({
      url: 'https://localhost:8081/v1/channels/transactions',
      type: 'post',
      data: JSON.stringify(requestBody),
      headers: {
        'grpc-metadata-macaroon': macaroon
      },
      dataType: 'json',
      success: function (data) {
          console.info(data);
      }
  });

});

$("#getinfo").on("click", function() {

  $.ajax({
    url: 'https://127.0.0.1:8081/v1/payreq/lnbc120n1pw0sdp8pp5446htvu398ke03nvtw3rzh50l4n50dzzpcv3ck4mefp9ry3fg67sdqqcqzpgyuldnperv4jm7egv5vs3r3h00jutc4cw8duu5m5cqdlwg6yaz07nphartralf9zg6ehmzmhgnrktrnegqzcyj0zdrdgfzaxm76aktucpqq3t0t',
    type: 'get',
    headers: {
      'grpc-metadata-macaroon': macaroon
    },
    dataType: 'json',
    success: function (data) {
        console.info(data);
    }
  });
  
})

// IT CAN GET COMPLICATED
// as a user I can slide `sat`
// as a user I can slide `usd`
// all 4 input fields need to stay in sync


let satoshisPerSecond = 100; // this is the base currency
let dollarsPerHour;


// OFFLINE
// $.get("https://api.coindesk.com/v1/bpi/currentprice.json", function(response) {
//   let BTCUSD = JSON.parse(response).bpi.USD.rate_float;
//   price1sat = BTCUSD / 100000000;
//   updateSliders();
// })

const price1sat = 8000 / 100000000; // for simplicity, we assume the price is constant and does not fluctuate that much TODO: in the future add periodical check but worried if everything goes out of range
updateSliders();
$("#sat-range").val(satoshisPerSecond);
$("#sat-number").val(satoshisPerSecond);

// Satoshis are limited between 1 and 1000. For USD it will be different. Always `sat` as base currency
function setMaxDollarValues() {
  let maxPerHour = Math.ceil(1000 * price1sat * 3600);
  $("#dol-number").attr("max", maxPerHour);
  $("#dol-range").attr("max", maxPerHour);
}

setMaxDollarValues();


function updateSliders(satoshis) {
  if (satoshis === false) { // option when it was dollars per hour that changed, otherwise default satoshis per second
    satoshisPerSecond = Math.ceil((dollarsPerHour / 3600) / price1sat);
    $("#sat-number").val(satoshisPerSecond);
    $("#sat-range").val(satoshisPerSecond);
  } else {
    dollarsPerHour = Math.ceil(satoshisPerSecond * 3600 * price1sat);
    $("#dol-number").val(dollarsPerHour);
    $("#dol-range").val(dollarsPerHour);
  }
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
  dropArea.classList.remove('active')
}

function handleDrop(e) {
  file = e.dataTransfer.files[0]; 
  if (file) {
    fileReader = new FileReader();
    fileReader.onload = function(e) {
      var content = e.target.result;
      console.log(content);
    };
    fileReader.readAsText(file);
  }
}