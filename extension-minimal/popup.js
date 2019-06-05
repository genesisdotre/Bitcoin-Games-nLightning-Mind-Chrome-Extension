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
