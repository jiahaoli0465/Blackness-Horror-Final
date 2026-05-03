const sections = [
  { id: "opening", label: "Opening" },
  { id: "lake", label: "The Lake" },
  { id: "candyman", label: "Candyman" },
  { id: "blackening", label: "The Blackening" },
  { id: "synthesis", label: "Synthesis" },
];

const aboutDialog = document.querySelector("[data-about-dialog]");
const openAboutButtons = document.querySelectorAll("[data-open-about]");
const closeAboutButton = document.querySelector("[data-close-about]");
const progressLabel = document.querySelector("[data-progress-label]");
const progressFill = document.querySelector("[data-progress-fill]");
const cursorGlow = document.querySelector(".cursor-glow");
const navLinks = Array.from(document.querySelectorAll(".nav a"));
const revealItems = document.querySelectorAll(".quote-card, .reveal-item");

function openAbout() {
  if (!aboutDialog) return;

  if (typeof aboutDialog.showModal === "function") {
    aboutDialog.showModal();
    return;
  }

  aboutDialog.setAttribute("open", "");
}

function closeAbout() {
  if (!aboutDialog) return;
  aboutDialog.close();
}

function getCurrentSection() {
  const midpoint = window.scrollY + window.innerHeight * 0.42;

  return (
    sections
      .map((section) => {
        const node = document.getElementById(section.id);
        return {
          ...section,
          top: node ? node.offsetTop : 0,
        };
      })
      .filter((section) => midpoint >= section.top)
      .at(-1) || sections[0]
  );
}

function updateProgress() {
  const doc = document.documentElement;
  const maxScroll = doc.scrollHeight - window.innerHeight;
  const progress = maxScroll <= 0 ? 0 : (window.scrollY / maxScroll) * 100;
  const current = getCurrentSection();

  if (progressFill) {
    progressFill.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }

  if (progressLabel) {
    progressLabel.textContent = current.label;
  }

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${current.id}`;
    link.classList.toggle("active", isActive);
  });
}

function updateCursorGlow(event) {
  if (!cursorGlow) return;
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
}

openAboutButtons.forEach((button) => {
  button.addEventListener("click", openAbout);
});

closeAboutButton?.addEventListener("click", closeAbout);

aboutDialog?.addEventListener("click", (event) => {
  if (event.target === aboutDialog) {
    closeAbout();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && aboutDialog?.open) {
    closeAbout();
  }
});

window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
window.addEventListener("pointermove", updateCursorGlow, { passive: true });

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
  },
);

revealItems.forEach((card, index) => {
  card.style.transitionDelay = `${Math.min(index % 4, 3) * 90}ms`;
  revealObserver.observe(card);
});

updateProgress();
