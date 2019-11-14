"use strict";

fetch("timeline.svg")
  .then(e => e.text())
  .then(data => loadSVG(data));

function loadSVG(data) {
  document.querySelector(".SVG_timeline").innerHTML = data;
  main();
}

function main() {
  const elms = document.querySelectorAll("section");

  const config = {
    root: null, //document.querySelector('#some-element')
    rootMargin: "0px",
    threshold: [0, 0.5, 0.75, 1]
  };

  let observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      let lastChar = entry.target.id[entry.target.id.length - 1];
      if (entry.intersectionRatio > 0.35) {
        entry.target.classList.add("focus");
        document.querySelector("#circle" + lastChar).style.fill = "pink";
      } else {
        entry.target.classList.remove("focus");
        document.querySelector("#circle" + lastChar).style.fill = "var(--main-bg-color)";
      }
      console.log(entry.intersectionRatio);
    });
  }, config);

  elms.forEach(elem => {
    observer.observe(elem);
  });
}
