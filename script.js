// =========================================
// FIND THE NAVIGATION ELEMENTS
// =========================================

const menuButton = document.querySelector(".menu-toggle");

const navigation = document.querySelector(".navigation");

const navigationLinks = [
  ...navigation.querySelectorAll("a:not(.nav-cta)")
];

const navIndicator = navigation.querySelector(".nav-indicator");

const pageSections = navigationLinks.map((link) => {
  return document.querySelector(link.getAttribute("href"));
});

let currentSection = 0;

let scrollUpdatePending = false;


// =========================================
// POSITION THE MOVING NAVIGATION LINE
// =========================================

function positionIndicator() {
  const link = navigationLinks[currentSection];

  // Stop if the link is missing or currently hidden.
  if (!link || !link.getClientRects().length) {
    return;
  }

  const navBox = navigation.getBoundingClientRect();

  const linkBox = link.getBoundingClientRect();

  navIndicator.style.width = `${linkBox.width}px`;

  navIndicator.style.transform = `translate(
    ${linkBox.left - navBox.left}px,
    ${linkBox.bottom - navBox.top + 6}px
  )`;
}


// =========================================
// FIND WHICH SECTION IS ON SCREEN
// =========================================

function updateActiveSection() {
  const headerHeight =
    document.querySelector(".site-header").offsetHeight;

  const viewingLine =
    headerHeight + (window.innerHeight - headerHeight) * 0.25;

  let active = 0;

  pageSections.forEach((section, index) => {
    if (
      section &&
      section.getBoundingClientRect().top <= viewingLine
    ) {
      active = index;
    }
  });

  // If the visitor reaches the bottom, highlight Contact.
  if (
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight - 2
  ) {
    active = pageSections.length - 1;
  }

  currentSection = active;

  // Mark the current navigation link.
  navigationLinks.forEach((link, index) => {
    if (index === active) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  positionIndicator();
}


// =========================================
// UPDATE THE LINE WHILE SCROLLING
// =========================================

window.addEventListener(
  "scroll",
  () => {
    if (!scrollUpdatePending) {
      window.requestAnimationFrame(() => {
        updateActiveSection();
        scrollUpdatePending = false;
      });

      scrollUpdatePending = true;
    }
  },
  { passive: true }
);

window.addEventListener("load", updateActiveSection);


// =========================================
// MOBILE MENU
// =========================================

function closeMenu() {
  navigation.classList.remove("open");

  menuButton.setAttribute("aria-expanded", "false");

  menuButton.setAttribute("aria-label", "Open navigation");
}

menuButton.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");

  menuButton.setAttribute("aria-expanded", String(isOpen));

  menuButton.setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Open navigation"
  );

  if (isOpen) {
    positionIndicator();
  }
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    closeMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 700) {
    closeMenu();
  }

  updateActiveSection();
});


// =========================================
// REVEAL CONTENT WHILE SCROLLING
// =========================================

const sections = document.querySelectorAll(".reveal");

if (
  "IntersectionObserver" in window &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  document.documentElement.classList.add("js");

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");

          currentObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08
    }
  );

  sections.forEach((section) => {
    observer.observe(section);
  });
}

// =========================================
// AUTOMATIC FOOTER YEAR
// =========================================

document.querySelector("#year").textContent =
  new Date().getFullYear();