// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let changeColor = document.getElementById('changeColor');

chrome.storage.sync.get('color', function(data) {
  changeColor.style.backgroundColor = data.color;
  changeColor.setAttribute('value', data.color);
});

changeColor.onclick = function(element) {
  let color = element.target.value;
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {code: 'document.body.style.backgroundColor = "' + color + '";'});
  });
};

let websites;

chrome.storage.sync.get('websites', function(data) {

  if($.isEmptyObject(data)) {
    websites = [];
  } else {
    websites = data.websites;
  }

  let markup = "";
  websites.forEach(function(website) {
    markup += "<div>" + website + "</div>";
  });

  $("#websites").html(markup);

});


console.log("popup");

$("#add").on("submit", function(event) {

  let val = $("#url").val();

  console.log(val);


  websites.push(val);

  chrome.storage.sync.set({ websites: websites }, function() {
    console.log("storage updated");
  })



  event.preventDefault();
  return false;

})