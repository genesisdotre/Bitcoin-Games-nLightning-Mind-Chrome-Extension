// listening for changes from extension popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.satoshis) {
    console.log("New satoshis per second: " + request.satoshis);
    satoshis = request.satoshis;
  }
});

let intervalId;
let timeSeconds = 600; // 10 minutes max, don't want to eat all your money
let delay5seconds = 5; // sending payment every 5 seconds
let start;

function timeIsUp() {
    window.top.postMessage('timeIsUp', '*');
    clearInterval(intervalId);
    $(".screen").hide();
    $(".screen.failed").show();
}

$("#done").on("click", function() {
    _closeTab();
});

$("#form").on("submit", function(event) {
    let task = $("#task").val() ? $("#task").val() : "Something important, really";
    $("#workingOn").text(task); // copy paste from the form

    startCountdown();

    event.preventDefault();
    return false;
});

function startCountdown() {
    $("body").addClass("fraud"); // changing background image to Craig Wright
    $(".screen").hide();
    $(".screen.countdown").show();
    start = new Date();
    requestAnimationFrame(moveMe);

    function countdown() {
        if (timeSeconds === 0) {
            timeIsUp();
        }
        if (timeSeconds % delay5seconds === 0) {
          createInvoice(satoshis * delay5seconds).then(function(invoice) {
              getInfoInvoice(invoice).then(function(resp) { console.log(resp) });
              payInvoice(invoice).then(function(resp) { console.log(resp) });
          })
        }
        timeSeconds--;
    }
    countdown(); // calling it once immediately and then again in the setInterval
    intervalId = setInterval(countdown, 1000);
    window.top.postMessage('start', '*');
}

function _closeTab() {
    // alert("closing tab works but for debugging I prefer to keep it open"); // IT REALLY WORKS
    chrome.tabs.getCurrent(function(tab) {
        chrome.tabs.remove(tab.id, function() { });
    });
}

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    console.log(tabs);
    var tab = tabs[0];
    var url = new URL(tab.url)
    var domain = url.hostname
    $("#thisSite").text(domain);
})

let macaroon;
let satoshis;
let alertShown = false;
function showAlert() {
  if (!alertShown) {
    alertShown = true;
    alert("need to configure extension first with admin.macaroon");
  }
}

chrome.storage.sync.get("macaroon", function(data) {
    if(data && data.macaroon) {
        macaroon = data.macaroon;
    } else {
        showAlert();
    }
});

chrome.storage.sync.get("satoshis", function(data) {
    if(data && data.satoshis) {
        satoshis = data.satoshis;
    } else {
        showAlert();
    }
});

// INVOICES
function createInvoice(amount) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: 'https://api.opennode.co/v1/charges',
            type: 'post',
            data: JSON.stringify({ amount: amount }),
            headers: {
              'Authorization': '120c2f48-a2c6-4bc7-9950-939b5526af07' // hard coded API key? HMMM...
            },
            dataType: 'json',
            contentType: "application/json",
            success: function (response) {
                resolve(response.data.lightning_invoice.payreq);
            }
        });
        
    });
}

function payInvoice(invoice) {
    return new Promise(function(resolve, reject) {

          var requestBody = { 
            payment_request: invoice,
          };
         
          $.ajax({
              url: 'https://localhost:8081/v1/channels/transactions',
              type: 'post',
              data: JSON.stringify(requestBody),
              headers: {
                'Grpc-Metadata-macaroon': macaroon
              },
              dataType: 'json',
              success: function (response) {
                  resolve(response);
              }
          });
  
    });
}

function getInfoInvoice(invoice) {
    return new Promise(function(resolve, reject) {

        $.ajax({
        url: 'https://127.0.0.1:8081/v1/payreq/' + invoice,
        type: 'get',
        headers: {
            'grpc-metadata-macaroon': macaroon
        },
        dataType: 'json',
        success: function (response) {
            resolve(response);
        }
        });
    
    })
}


// ANIMATED FLOW OF SATOSHIS AND TICKING COUNTER
function getVariation() {
  let rnd = Math.floor(Math.random() * 1000);
  let variation = 0;

  if (rnd < 100) {
    variation = -3;
  } else if (rnd < 250) {
    variation = -2;
  } else if (rnd < 400) {
    variation = -1;
  } else if (rnd < 600) {
    variation = 0;
  } else if (rnd < 750) {
    variation = 1;
  } else if (rnd < 900) {
    variation = 2;
  } else if (rnd < 1000) {
    variation = 3;
  }

  return variation;
}

let paidSoFar = 0; // price per second can change dynamically

function moveMe() {
  let now = new Date();
  let diff = new Date(now - start);

  let milliseconds = (diff.getMinutes() * 60 + diff.getSeconds()) * 1000 + diff.getMilliseconds(); // most likely milliseconds only
  let increase = (satoshis / 1000) * milliseconds;
  paidSoFar += increase;

  let satoshisText = "฿ 0." +("00000000" + Math.round(paidSoFar)).slice(-8)
  $("#satoshis").text(satoshisText);

  // MOVE THE THINGS...
  $("img.sat").toArray().forEach(function(sat) {

    // LEFT LEFT LEFT LEFT
    let currentLeft = parseFloat( $(sat).css("left").replace("px", "") );
    let variation = getVariation();
    let newLeft = currentLeft + 5 + variation;

    if (newLeft > 430) { // far behind screen
      $(sat).css({display: "none"}); // need to disable transition otherwise looks crap

      setTimeout(function() {
        $(sat).css({left: (-32 + getVariation())+"px", top: "10px", display: "block"});
      }, 300)
      
      return;
    } else {
      $(sat).css({"left": newLeft+"px"});
    }

    // TOP TOP TOP TOP TOP
    let currentTop = parseFloat( $(sat).css("top").replace("px", "") );

    variation = getVariation();

    let newTop = currentTop + variation;
    newTop = Math.min(newTop, 20);
    newTop = Math.max(newTop, 0);
    $(sat).css({"top": newTop});
  });

  start = now;
  requestAnimationFrame(moveMe);
}



// CRAIG WRIGHT YOUTUBE BUSINESS
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
  console.log("onYouTubeIframeAPIReady")
  player = new YT.Player('craig-wright-is-not-a-fraud-player', {
    height: '390',
    width: '640',
    videoId: '5DCAC1j2HTY',
    events: {
      'onReady': onPlayerReady
    }
  });
}

// HACK TO BUFFER https://stackoverflow.com/a/9864780/775359
function onPlayerReady(event) {
  player.seekTo(22);
}