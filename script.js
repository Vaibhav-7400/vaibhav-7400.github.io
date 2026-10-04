const menuButton = document.querySelector("[data-nav-toggle]");
const menu = document.querySelector("[data-nav-menu]");
function closeMenu() {
  if (!menu || !menuButton) return;
  menu.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
}
menuButton?.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  menu.classList.toggle("is-open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
});
menu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuButton?.getAttribute("aria-expanded") === "true") {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".nav")) closeMenu();
});
window.matchMedia("(min-width: 960px)").addEventListener("change", closeMenu);
const cards = [...document.querySelectorAll("[data-project]")];
const filterButtons = [...document.querySelectorAll("[data-filter]")];
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    let count = 0;
    cards.forEach((card) => {
      const show = button.dataset.filter === "all" || card.dataset.category.split(" ").includes(button.dataset.filter);
      card.hidden = !show;
      if (show) count += 1;
    });
    const countTarget = document.querySelector("[data-project-count]");
    if (countTarget) countTarget.textContent = count + (count === 1 ? " project" : " projects");
  });
});
const localLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
if (localLinks.length && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    const entry = entries.find((item) => item.isIntersecting);
    if (!entry) return;
    localLinks.forEach((link) => {
      if (link.hash === "#" + entry.target.id) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }, { rootMargin: "-18% 0px -60% 0px" });
  document.querySelectorAll("main section[id]").forEach((section) => observer.observe(section));
}
document.querySelectorAll("[data-year]").forEach((target) => { target.textContent = new Date().getFullYear(); });
document.querySelector("[data-copy-email]")?.addEventListener("click", async (event) => {
  const email = event.currentTarget.dataset.copyEmail;
  const status = document.querySelector("[data-copy-status]");
  try {
    await navigator.clipboard.writeText(email);
    status.textContent = "Email address copied.";
  } catch {
    status.textContent = "Email: " + email;
  }
});
