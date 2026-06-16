document.body.classList.add("js-ready");

const header = document.querySelector(".site-header");
const progress = document.querySelector(".scroll-progress");
const toTop = document.querySelector(".to-top");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#site-nav");
const navLinks = [...document.querySelectorAll("nav a")];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const questionData = [
  {
    title: "¿Qué necesita hoy el profesorado para enseñar mejor?",
    answer:
      "Identificar necesidades reales antes de abrir nuevas líneas de trabajo: tiempos, evaluación, materiales, coordinación, atención a la diversidad y aplicación práctica de EBI.",
  },
  {
    title: "¿Qué espera del Departamento de Innovación?",
    answer:
      "Definir una relación clara: apoyo pedagógico, escucha, recursos, acompañamiento y devolución visible de las prioridades asumidas.",
  },
  {
    title: "¿Qué aspectos de EBI necesitan claridad o simplificación?",
    answer:
      "Detectar dónde el sistema se vuelve difícil de aplicar y convertirlo en guías, criterios y ejemplos más manejables para cada etapa.",
  },
  {
    title: "¿Qué prácticas ya funcionan y pueden compartirse?",
    answer:
      "Localizar experiencias útiles que ya existen en el colegio para documentarlas, cuidarlas y hacerlas transferibles.",
  },
  {
    title: "¿Qué fricciones están dificultando el trabajo docente?",
    answer:
      "Mapear los puntos de carga o confusión y priorizar mejoras que reduzcan esfuerzo, ordenen procesos y faciliten el aula.",
  },
];

const updateChrome = () => {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = maxScroll > 0 ? scrollTop / maxScroll : 0;

  header.classList.toggle("is-scrolled", scrollTop > 24);
  toTop.classList.toggle("is-visible", scrollTop > 700);
  progress.style.transform = `scaleX(${ratio})`;
};

const updateActiveNav = () => {
  const checkpoint = window.scrollY + window.innerHeight * 0.36;
  let activeId = sections[0]?.id;

  sections.forEach((section) => {
    if (section.offsetTop <= checkpoint) {
      activeId = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${activeId}`);
  });
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  revealObserver.observe(element);
});

document.querySelectorAll(".question").forEach((button) => {
  button.addEventListener("click", () => {
    const index = Number(button.dataset.question);
    const selected = questionData[index];

    document.querySelectorAll(".question").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    document.querySelector("#active-question").textContent = selected.title;
    document.querySelector("#active-answer").textContent = selected.answer;
  });
});

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.filter;
    document.querySelectorAll(".filter").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    document.querySelectorAll(".service-card").forEach((card) => {
      const shouldShow = category === "all" || card.dataset.category === category;
      card.classList.toggle("is-hidden", !shouldShow);
      if (!shouldShow) {
        card.classList.remove("is-open");
        card.querySelector(".service-toggle")?.setAttribute("aria-expanded", "false");
      }
    });
  });
});

document.querySelectorAll(".service-toggle").forEach((button) => {
  const toggleService = () => {
    const card = button.closest(".service-card");
    const wasOpen = card.classList.contains("is-open");

    document.querySelectorAll(".service-card.is-open").forEach((openCard) => {
      if (openCard !== card) {
        openCard.classList.remove("is-open");
        openCard.querySelector(".service-toggle")?.setAttribute("aria-expanded", "false");
      }
    });

    card.classList.toggle("is-open", !wasOpen);
    button.setAttribute("aria-expanded", String(!wasOpen));
  };

  button.addEventListener("click", toggleService);
  button.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleService();
    }
  });
});

menuToggle.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("nav-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    document.body.classList.remove("nav-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

toTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", () => {
  updateChrome();
  updateActiveNav();
});

window.addEventListener("resize", updateActiveNav);

updateChrome();
updateActiveNav();
