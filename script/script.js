"use strict";

fetch("timeline.svg")
  .then(e => e.text())
  .then(data => loadSVG(data));

function loadSVG(data) {
  document.querySelector(".theSVG").innerHTML = data;
}
