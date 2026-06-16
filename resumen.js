document.body.classList.add("js-ready");

const sections = [...document.querySelectorAll("main > section")];
const navLinks = [...document.querySelectorAll("nav a")];

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.18 }
);

document.querySelectorAll(".reveal").forEach((element) => {
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
  { threshold: [0.38, 0.55, 0.72] }
);

sections.forEach((section) => activeObserver.observe(section));

const goToSection = (direction) => {
  const currentIndex = sections.findIndex((section) => {
    const rect = section.getBoundingClientRect();
    return rect.top <= window.innerHeight * 0.38 && rect.bottom >= window.innerHeight * 0.38;
  });
  const fallbackIndex = direction > 0 ? 0 : sections.length - 1;
  const nextIndex = Math.max(
    0,
    Math.min(sections.length - 1, (currentIndex >= 0 ? currentIndex : fallbackIndex) + direction)
  );

  sections[nextIndex]?.scrollIntoView({ behavior: "smooth" });
};

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowDown" || event.key === "PageDown") {
    event.preventDefault();
    goToSection(1);
  }

  if (event.key === "ArrowUp" || event.key === "PageUp") {
    event.preventDefault();
    goToSection(-1);
  }
});
