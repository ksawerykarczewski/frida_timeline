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
  const date = document.querySelector("#date_vertical");

  const config = {
    root: null, //document.querySelector('#some-element')
    rootMargin: "0px",
    threshold: [0, 0.5, 0.75, 1]
  };

  let observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      let lastChar = entry.target.id[entry.target.id.length - 1];
      let currentDate = entry.target.querySelector(".date").textContent;
      let currentYear = currentDate.substring(currentDate.length - 4);
      if (entry.intersectionRatio > 0.35) {
        // entry.target.classList.add("focus");
        document.querySelector("#circle" + lastChar).style.fill = "red";
        date.innerHTML = currentYear;
      } else {
        // entry.target.classList.remove("focus");
        document.querySelector("#circle" + lastChar).style.fill = "var(--main-bg-color)";
      }
    });
  }, config);

  elms.forEach(elem => {
    observer.observe(elem);
  });
  let circles = document.querySelectorAll("circle");
  circles.forEach(circle => {
    circle.addEventListener("click", scrollToSection);
  });

  function scrollToSection(e) {
    let lastCharId = e.target.id[e.target.id.length - 1];
    let currentSection = document.querySelector("#section" + lastCharId);
    currentSection.scrollIntoView({
      block: "start"
    });
  }
}
