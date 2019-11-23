"use strict";

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
  clone.querySelector(".text2 p").textContent = oneEvent.gsx$text2.$t;
  clone.querySelector(".point_img").src = "../imgs/" + oneEvent.gsx$image.$t;
  clone.querySelector(".painting").src = "../imgs/" + oneEvent.gsx$painting.$t;
  clone.querySelector(".point_img_caption").textContent = oneEvent.gsx$imagecaption.$t;
  clone.querySelector(".painting_caption").textContent = oneEvent.gsx$paintingcaption.$t;
  if (oneEvent.gsx$quote.$t != "") {
    clone.querySelector(".quote").textContent = oneEvent.gsx$quote.$t;
    clone.querySelector(".quote").style.display = "block";
  }

  // clone.querySelector(".point_img").addEventListener("click", e => {
  //   console.log("hi");
  //   let lastCharId = e.target.id[e.target.id.length - 1];

  //   document.querySelector(".big_image img#big_image" + lastCharId).classList.remove("hide");
  // });

  document.querySelector(".svgtext" + counter).textContent = oneEvent.gsx$heading.$t;

  // clone.querySelector("video source").src = "video/" + oneEvent.gsx$video.$t;
  const newLi = document.createElement("li");
  const newDiv = document.createElement("div");
  const newP = document.createElement("p");
  clone.querySelector(".doodle").id = "doodle" + counter;

  newP.textContent = oneEvent.gsx$heading.$t;
  newP.id = "category" + counter;

  fetch("imgs/svg/" + oneEvent.gsx$doodlesvg.$t)
    .then(e => e.text())
    .then(data => loadSVG(data));

  function loadSVG(data) {
    newDiv.innerHTML = data;
    clone.querySelector(".doodle").innerHTML = data;
    document.querySelector("main").appendChild(clone);
    main();
  }

  newLi.appendChild(newDiv);
  newLi.appendChild(newP);

  modalUl.appendChild(newLi);
  counter++;
}
function main() {
  zoomHero();
  const elms = document.querySelectorAll("section");
  const date = document.querySelector("#date_vertical h1");

  const config = {
    root: null, //document.querySelector('#some-element')
    rootMargin: "0px",
    threshold: [0, 0.01, 0.28, 0.3, 0.31, 0.49, 0.5, 0.75, 1]
  };

  // INTERSECTION OBSERVER FOR IMAGES

  const imgs = document.querySelectorAll(".point_img");

  let observerImg = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.intersectionRatio > 0.65) {
        entry.target.classList.add("animate");
        document.querySelector("#grave").style.display = "block";
        let grav = document.querySelector("#grave");
        // console.log(grav.getTotalLength());
      } else if (entry.target.classList.contains("animate")) {
        entry.target.classList.remove("animate");
        document.querySelector("#grave").style.display = "none";
      }
    });
  }, config);

  imgs.forEach(img => {
    observerImg.observe(img);
  });

  let observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      let lastChar = entry.target.id[entry.target.id.length - 1];
      let currentDate = entry.target.querySelector(".date").textContent;
      let currentYear = currentDate.substring(currentDate.length - 4);
      if (entry.intersectionRatio > 0.27) {
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
    console.log("now hi");
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

// Code taken from Epicurrence magazine - Summer Revival issue
function zoomHero() {
  window.addEventListener("scroll", function() {
    let speed = 7;
    let size = 100 + this.window.scrollY / speed;
    this.document.querySelector(".hero").style.backgroundSize = size + "% " + size + "%";
  });
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

// LOTTIE ANIMATIONS

let burger_animation = lottie.loadAnimation({
  container: document.querySelector("#bm"), // the dom element that will contain the animation
  renderer: "svg",
  loop: false,
  autoplay: false,
  path: "data_menu.json" // the path to the animation json
});
burger_animation.setSpeed(2.1);

// FADE IN ANIMATION
//https://www.npmjs.com/package/aos
AOS.init({
  duration: 1200
});
