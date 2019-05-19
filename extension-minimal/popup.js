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
    $("#websites").html("Nothing saved. Restore defaults or add your one");
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

  console.log($(this));
  console.log("x clicked");

})