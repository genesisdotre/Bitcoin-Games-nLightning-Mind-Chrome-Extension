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
    _closeTab();
});

$("#closeTheTab").on("click", function() {
    _closeTab();
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


// chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     console.log(tabs);
//     var tab = tabs[0];
//     var url = new URL(tab.url)
//     var domain = url.hostname
//     $("#thisSite").text(domain);
// })


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