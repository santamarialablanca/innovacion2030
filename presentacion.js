document.body.classList.add("js-ready");

const slides = [...document.querySelectorAll(".slide")];
const navLinks = [...document.querySelectorAll("nav a")];

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll(".reveal, .slide-heading, .context-card, .focus-board article, .three-years article, .evidence-grid article").forEach((element) => {
  element.classList.add("reveal");
  revealObserver.observe(element);
});

const activeObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`);
    });
  },
  { threshold: [0.45, 0.6, 0.75] }
);

slides.forEach((slide) => activeObserver.observe(slide));

const goToSlide = (direction) => {
  const currentIndex = slides.findIndex((slide) => {
    const rect = slide.getBoundingClientRect();
    return rect.top <= window.innerHeight * 0.36 && rect.bottom >= window.innerHeight * 0.36;
  });
  const nextIndex = Math.max(0, Math.min(slides.length - 1, currentIndex + direction));
  slides[nextIndex]?.scrollIntoView({ behavior: "smooth" });
};

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowDown" || event.key === "PageDown") {
    event.preventDefault();
    goToSlide(1);
  }

  if (event.key === "ArrowUp" || event.key === "PageUp") {
    event.preventDefault();
    goToSlide(-1);
  }
});
