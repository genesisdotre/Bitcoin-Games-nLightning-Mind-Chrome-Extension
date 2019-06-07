console.log("I'm included in iframed.html, my name is iframed.js");

let intervalId;
let timeSeconds = 500;

function timeIsUp() {
    window.top.postMessage('timeIsUp', '*');
    clearInterval(intervalId);
    $(".screen").hide();
    $(".screen.failed").show();
}

$("#done").on("click", function() {
    // _closeTab();
    clearInterval(intervalId);
});

$("#form").on("submit", function(event) {
    let task = $("#task").val();
    $("#workingOn").text(task); // copy paste from the form

    startCountdown();

    event.preventDefault();
    return false;
});


function startCountdown() {
    $(".screen").hide();
    $(".screen.countdown").show();

    function countdown() {
        if (timeSeconds === 0) {
            timeIsUp();
        }
        if (timeSeconds % 5 === 0) {
            createInvoice(10).then(function(invoice) {
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

chrome.storage.sync.get("macaroon", function(data) {
    if(data && data.macaroon) {
        macaroon = data.macaroon;
    } else {
        alert("need to configure extension first with admin.macaroon");
    }
});

// INVOICES
function createInvoice(sat) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: 'https://api.opennode.co/v1/charges',
            type: 'post',
            data: JSON.stringify({ amount: 10 }),
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

let macaroon = "0201036c6e6402cf01030a1054a03ffe820ed30ff7301b5b7645e6a21201301a160a0761646472657373120472656164120577726974651a130a04696e666f120472656164120577726974651a170a08696e766f69636573120472656164120577726974651a160a076d657373616765120472656164120577726974651a170a086f6666636861696e120472656164120577726974651a160a076f6e636861696e120472656164120577726974651a140a057065657273120472656164120577726974651a120a067369676e6572120867656e6572617465000006206fbbce082e4ed2359d5eb9cbf87d2365d4388394a4022db180c51e8eac2d3a5d";

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


// ANIMATED FLOW OF SATOSHIS

let start = new Date();

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

function moveMe() {
  let now = new Date();
  let diff = new Date(now - start);

  let milliseconds = (diff.getMinutes() * 60 + diff.getSeconds()) * 1000 + diff.getMilliseconds()
  let satoshisPerMillisecond = 347.22 / 1000; // just like example https://bitcoin.stackexchange.com/q/88117/11112

  let satoshisText = "฿ 0." +("00000000" + Math.round(milliseconds * satoshisPerMillisecond)).slice(-8)
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

  requestAnimationFrame(moveMe);
}

requestAnimationFrame(moveMe);