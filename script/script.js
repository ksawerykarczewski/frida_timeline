"use strict";
// // FADE IN ANIMATION
// AOS.init({
//   duration: 1200
// });

const link = "https://spreadsheets.google.com/feeds/list/1RFOqG5y5zjhd7gwNB5fC9Wgw-XaPf4PjEMYlEBaOj-M/od6/public/values?alt=json";
const template = document.querySelector("template").content;
let counter = 1;

const modal = document.querySelector(".modal-bg");
const modalUl = document.querySelector(".modal-content ul");

fetch("../timeline with tooltip.svg")
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
  document.querySelector(".svgtext" + counter).textContent = oneEvent.gsx$heading.$t;

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
  const date = document.querySelector("#date_vertical h1");

  const config = {
    root: null, //document.querySelector('#some-element')
    rootMargin: "0px",
    threshold: [0, 0.01, 0.3, 0.31, 0.49, 0.5, 0.75, 1]
  };

  // let observer = new IntersectionObserver(entries => {
  //   entries.forEach(entry => {
  //     let lastChar = entry.target.id[entry.target.id.length - 1];
  //     let currentDate = entry.target.querySelector(".date").textContent;
  //     let currentYear = currentDate.substring(currentDate.length - 4);
  //     if (entry.intersectionRatio > 0) {
  //       document.querySelector("#category" + lastChar).style.textDecoration =
  //         "underline";
  //       // entry.target.classList.add("focus");
  //       document.querySelector("#circle" + lastChar).style.fill = "black";
  //     } else {
  //       document.querySelector("#category" + lastChar).style.textDecoration =
  //         "none";
  //       // entry.target.classList.remove("focus");
  //       document.querySelector("#circle" + lastChar).style.fill =
  //         "var(--main-bg-color)";
  //     }
  //     //code from stack overflow https://stackoverflow.com/questions/31223341/detecting-scroll-direction
  //     window.onscroll = function(e) {
  //       if (this.oldScroll < this.scrollY) {
  //         if (date.innerHTML < currentYear) {
  //           date.classList.add("year-animation");
  //           date.addEventListener("animationend", () => {
  //             date.innerHTML = currentYear;
  //             // date.classList.add("year-animationback");
  //             date.classList.remove("year-animation");
  //           });
  //         }
  //       } else if (this.oldScroll > this.scrollY) {
  //         if (date.innerHTML > currentYear) {
  //           date.classList.add("year-animation");
  //           date.addEventListener("animationend", () => {
  //             date.innerHTML = currentYear;
  //             // date.classList.add("year-animationback");
  //             date.classList.remove("year-animation");
  //           });
  //         }
  //       }
  //       this.oldScroll = this.scrollY;
  //     };
  //   });
  // }, config);

  let observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      let lastChar = entry.target.id[entry.target.id.length - 1];
      let currentDate = entry.target.querySelector(".date").textContent;
      let currentYear = currentDate.substring(currentDate.length - 4);
      if (entry.intersectionRatio > 0) {
        if (entry.target.id == "section1" && entry.intersectionRatio > 0.3) {
          document.querySelector(".SVG_timeline").classList.add("opacity-animation");
        }
        document.querySelector("#category" + lastChar).style.textDecoration = "underline";
        document.querySelector("#circle" + lastChar).style.fill = "black";

        //code from stack overflow https://stackoverflow.com/questions/31223341/detecting-scroll-direction
        window.onscroll = function(e) {
          if (this.oldScroll < this.scrollY) {
            if (date.innerHTML < currentYear) {
              date.classList.add("year-animation");
              date.addEventListener("animationend", () => {
                date.innerHTML = currentYear;
                // date.classList.add("year-animationback");
                date.classList.remove("year-animation");
              });
            }
          } else if (this.oldScroll > this.scrollY) {
            if (date.innerHTML > currentYear) {
              date.classList.add("year-animation");
              date.addEventListener("animationend", () => {
                date.innerHTML = currentYear;
                // date.classList.add("year-animationback");
                date.classList.remove("year-animation");
              });
            }
          }
          this.oldScroll = this.scrollY;
        };
      } else {
        document.querySelector("#category" + lastChar).style.textDecoration = "none";
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
    circle.addEventListener("mouseenter", showTooltip);
    circle.addEventListener("mouseleave", hideTooltip);
  });

  function showTooltip(e) {
    let id = e.target.id[e.target.id.length - 1];
    document.querySelector(".svgtext" + id).style.display = "block";
    document.querySelector(".path" + id).style.display = "block";
  }

  function hideTooltip(e) {
    let id = e.target.id[e.target.id.length - 1];
    document.querySelector(".svgtext" + id).style.display = "none";
    document.querySelector(".path" + id).style.display = "none";
  }

  function scrollToSection(e) {
    if (!modal.classList.contains("hide")) {
      modal.classList.add("hide");
      burger_animation.setDirection(-1);
      burger_animation.play();
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
  document.querySelector("#bm").addEventListener("click", toggleModal);
}

function toggleModal() {
  if (modal.classList.contains("hide")) {
    modal.classList.remove("hide");
    burger_animation.setDirection(1);
    burger_animation.play();
  } else {
    modal.classList.add("hide");
    burger_animation.setDirection(-1);
    burger_animation.play();
  }
}

let burger_animation = lottie.loadAnimation({
  container: document.querySelector("#bm"), // the dom element that will contain the animation
  renderer: "svg",
  loop: false,
  autoplay: false,
  path: "data_menu.json" // the path to the animation json
});

let grave_animation = lottie.loadAnimation({
  container: document.querySelector("#grave"), // the dom element that will contain the animation
  renderer: "svg",
  loop: true,
  autoplay: true,
  path: "grave2.json" // the path to the animation json
});

burger_animation.setSpeed(2.1);
