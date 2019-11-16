"use strict";
// // FADE IN ANIMATION
// AOS.init({
//   duration: 1200
// });

// fetch("timeline.svg")
//   .then(e => e.text())
//   .then(data => loadSVG(data));

// function loadSVG(data) {
//   document.querySelector(".SVG_timeline").innerHTML = data;
//   main();
// }

// function main() {
//   const elms = document.querySelectorAll("section");
//   const date = document.querySelector("#date_vertical");

//   const config = {
//     root: null, //document.querySelector('#some-element')
//     rootMargin: "0px",
//     threshold: [0, 0.5, 0.75, 1]
//   };

//   let observer = new IntersectionObserver(entries => {
//     entries.forEach(entry => {
//       let lastChar = entry.target.id[entry.target.id.length - 1];
//       let currentDate = entry.target.querySelector(".date").textContent;
//       let currentYear = currentDate.substring(currentDate.length - 4);
//       if (entry.intersectionRatio > 0.35) {
//         // entry.target.classList.add("focus");
//         document.querySelector("#circle" + lastChar).style.fill = "black";
//         date.innerHTML = currentYear;
//         // date.dataset.dataAos = "fade-in";

//         // date.innerHTML = `data-aos="fade-down"`;
//       } else {
//         // entry.target.classList.remove("focus");
//         document.querySelector("#circle" + lastChar).style.fill = "var(--main-bg-color)";
//       }
//     });
//   }, config);

//   elms.forEach(elem => {
//     observer.observe(elem);
//   });
//   let circles = document.querySelectorAll("circle");
//   circles.forEach(circle => {
//     circle.addEventListener("click", scrollToSection);
//   });

//   function scrollToSection(e) {
//     let lastCharId = e.target.id[e.target.id.length - 1];
//     let currentSection = document.querySelector("#section" + lastCharId);
//     currentSection.scrollIntoView({
//       block: "start"
//     });
//   }
// }

const link = "https://spreadsheets.google.com/feeds/list/1RFOqG5y5zjhd7gwNB5fC9Wgw-XaPf4PjEMYlEBaOj-M/od6/public/values?alt=json";
const template = document.querySelector("template").content;
let counter = 1;

const modal = document.querySelector(".modal-bg");
const modalUl = document.querySelector(".modal-content ul");

fetch("../timeline.svg")
  .then(e => e.text())
  .then(data => loadSVG(data));

function loadSVG(data) {
  document.querySelector(".SVG_timeline").innerHTML = data;
  fetchLink(link);
}

function fetchLink(link) {
  fetch(link)
    .then(e => e.json())
    .then(data => data.feed.entry.forEach(displayEvent));
}

function displayEvent(oneEvent) {
  const clone = template.cloneNode("true");

  if (counter == 10) {
    counter = 0;
  }
  clone.querySelector("section").id = "section" + counter;
  clone.querySelector("h1").textContent = oneEvent.gsx$heading.$t;
  clone.querySelector(".date").textContent = oneEvent.gsx$date.$t;
  clone.querySelector(".text p").textContent = oneEvent.gsx$text.$t;
  clone.querySelector(".point_img").src = "../imgs/" + oneEvent.gsx$image.$t;
  clone.querySelector(".painting").src = "../imgs/" + oneEvent.gsx$painting.$t;
  clone.querySelector(".quote").textContent = oneEvent.gsx$quote.$t;
  // clone.querySelector("video source").src = "video/" + oneEvent.gsx$video.$t;
  const newLi = document.createElement("li");
  const newDiv = document.createElement("div");
  const newP = document.createElement("p");

  newP.textContent = oneEvent.gsx$heading.$t;
  newP.id = "category" + counter;

  fetch("imgs/svg/" + oneEvent.gsx$doodlesvg.$t)
    .then(e => e.text())
    .then(data => loadSVG(data));

  function loadSVG(data) {
    newDiv.innerHTML = data;
  }

  newLi.appendChild(newDiv);
  newLi.appendChild(newP);

  modalUl.appendChild(newLi);
  counter++;

  document.querySelector("main").appendChild(clone);
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
      if (entry.intersectionRatio > 0) {
        document.querySelector("#category" + lastChar).style.textDecoration = "underline";
        // entry.target.classList.add("focus");
        document.querySelector("#circle" + lastChar).style.fill = "black";
        date.innerHTML = currentYear;
      } else {
        document.querySelector("#category" + lastChar).style.textDecoration = "none";
        // entry.target.classList.remove("focus");
        document.querySelector("#circle" + lastChar).style.fill = "var(--main-bg-color)";
      }
      // console.log(entry.intersectionRatio);
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
    if (!modal.classList.contains("hide")) {
      modal.classList.add("hide");
    }
    let lastCharId = e.target.id[e.target.id.length - 1];
    let currentSection = document.querySelector("#section" + lastCharId);
    currentSection.scrollIntoView({
      block: "start"
    });
  }

  let categories = document.querySelectorAll("li");
  categories.forEach(cat => {
    cat.addEventListener("click", scrollToSection);
  });

  document.querySelector(".close-btn").addEventListener("click", hideModal);
  document.querySelector(".topnav img").addEventListener("click", showModal);
}
function hideModal() {
  modal.classList.add("hide");
}
function showModal() {
  modal.classList.remove("hide");
}
