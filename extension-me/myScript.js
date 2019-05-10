var areWeDoingThisOrNot = true;

// var urls = ["onet.pl", "michalstefanow.com", "localhost"]; // TODO: read from options storage
// urls.forEach(function(url) {
//   if (location.href.indexOf(url) !== -1) { // FIXME: could be any part of URL
//     areWeDoingThisOrNot = true;
//   }
// })

// https://stackoverflow.com/questions/28186349/chrome-extension-set-to-run-at-document-start-is-running-too-fast
document.addEventListener('DOMContentLoaded', fireContentLoadedEvent);

function fireContentLoadedEvent () {
  if(areWeDoingThisOrNot) {
    doThis(); // also show body but add the counter as well
  } else {
    $("body").show(); // show content, we are not one of these website
  }
}

function doThis() {



  // let traditionalAngularMarkup = 
  //   `
  //     <div id="angular-app" ng-controller="ctrl">
  //       {{ message }}
  //     </div>
  //   `
  // $(traditionalAngularMarkup).prependTo("body");

  // angular.element(function() { // manually bootstrapping
  //   angular.bootstrap(document.getElementById('angular-app'), ['app']);
  // });

  // var app = angular.module("app", []);

  // app.controller("ctrl", function($scope) {
  //   $scope.message = "Angular from myScript";
  // });


  ////////////////////////////////////////// 


  // let shadowDomMarkup = 
  // `
  //   <my-info-box>
  //     <span slot="top">I'm in the shadow DOM injected by extension</span>
  //   </my-info-box>
  // `;

  // $(shadowDomMarkup).prependTo("body");

  // (function() {
  //   const template = document.createElement('template');

  //   template.innerHTML = `
  //     <style>
  //       :host {
  //         display: block;
  //         background: red;
  //         border: 10px dashed black;
  //       }
  //     </style>

  //     <div>
  //       <slot name="top"></slot>
  //     </div>
  //   `;

  //   class MyInfoBox extends HTMLElement {
  //     constructor() {
  //       super();

  //       this.attachShadow({ mode: 'open' });
  //       this.shadowRoot.appendChild(template.content.cloneNode(true));
  //     }
  //   }

  //   window.customElements.define('my-info-box', MyInfoBox);
    
  // })();

  https://developer.chrome.com/extensions/extension#method-getURL
  var path = chrome.runtime.getURL("iframed.html");
  var iframeMarkup = "<iframe id='iframed' src='" + path + "'></iframe>";
  
  $(iframeMarkup).prependTo("body");

}
