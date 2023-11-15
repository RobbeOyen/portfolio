const circleLinks = document.querySelectorAll(".circle a");
circleLinks.forEach((link, index) => {
  const angleDelta = 360 / circleLinks.length;
  const linkAngle = angleDelta * index;
  link.style.transform = `rotate(${linkAngle}deg) translate(100px, 0)`;
});

circleLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href");
    const targetElement = document.querySelector(targetId);
    const circleBackground = document.querySelector(".circle-background");
    const circleBackgroundHeight =
      circleBackground.getBoundingClientRect().height;
    const targetTop =
      targetElement.getBoundingClientRect().top +
      window.scrollY -
      circleBackgroundHeight;
    window.scrollTo({ top: targetTop, behavior: "smooth" });
  });
});

// Calculate the height for all sections
const sectionHeights = Array.from(document.querySelectorAll("section")).map(
  (section) => section.getBoundingClientRect().height
);
const totalHeight = sectionHeights.reduce((acc, height) => acc + height, 0);
const sectionFractions = sectionHeights.map((height) => {
  return height / totalHeight;
});
// Calculate the starting global fraction for each section
let accumulatedFraction = 0;
const startFractions = sectionFractions.map((fraction) => {
  const startFraction = accumulatedFraction;
  accumulatedFraction += fraction;
  return startFraction;
});

let prevScrollTop = 0;
let skipScrollEvent = false;
window.addEventListener("scroll", (e) => {
  const scrollTop = window.scrollY;
  const scrollHeight = document.documentElement.scrollHeight;
  const windowHeight = window.innerHeight;
  // Where are we in relative terms (0.0-1.0)?
  let windowScrollFraction = scrollTop / (scrollHeight - windowHeight);

  const scrollingDown = prevScrollTop < scrollTop;
  prevScrollTop = scrollTop;
  if (!skipScrollEvent) {
    if (windowScrollFraction >= 1.0 && scrollingDown) {
      skipScrollEvent = true;
      window.scrollTo({ top: 0 });
      windowScrollFraction = 0.0;
    } else if (windowScrollFraction <= 0.0 && !scrollingDown) {
      skipScrollEvent = true;
      window.scrollTo({ top: scrollHeight - windowHeight });
      windowScrollFraction = 1.0;
    }
  } else {
    skipScrollEvent = false;
  }

  // Map the window scroll fraction to a weighted global scroll fraction
  let globalScrollFraction = 0;

  for (let i = 0; i < sectionFractions.length; i++) {
    if (windowScrollFraction < startFractions[i] + sectionFractions[i]) {
      const relativeScroll =
        (windowScrollFraction - startFractions[i]) / sectionFractions[i];
      globalScrollFraction =
        startFractions[i] + sectionFractions[i] * relativeScroll;
      break;
    }
  }

  const angle = -globalScrollFraction * 360;

  const circleEl = document.querySelector(".circle");
  circleEl.style.transform = `rotate(${angle}deg)`;
});


function initSlideshow(selector) {
    const slideshowWrapperEl = document.querySelector(selector);
    const slideElements = slideshowWrapperEl.querySelectorAll('.slide');
    const prevSlideButton = slideshowWrapperEl.querySelector('.prev');
    const nextSlideButton = slideshowWrapperEl.querySelector('.next');
    let slideIndex = 0;

    prevSlideButton.addEventListener('click', showPrevSlide);
    nextSlideButton.addEventListener('click', showNextSlide);

    function updateSlideElements() {
        for (let i = 0; i < slideElements.length; i++) {
            slideElements[i].style.display = "none";
          }
        
          slideElements[slideIndex].style.display = "block";
    }

    function showPrevSlide() {
        slideIndex-=1;
        if (slideIndex < 0) {
            slideIndex = slideElements.length - 1;
        }
        updateSlideElements();
    }

    function showNextSlide() {
        slideIndex+=1;
        if (slideIndex > slideElements.length - 1) {
            slideIndex = 0;
        }
        updateSlideElements();
    }
    

    updateSlideElements();

}

initSlideshow('#slideshow-content-magazine');
initSlideshow('#slideshow-wish-you-were-here');