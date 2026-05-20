const state = {
  trip: null,
};

const selectors = {
  days: document.querySelector("#days-container"),
  tips: document.querySelector("#tips-container"),
  title: document.querySelector("#trip-title"),
  description: document.querySelector("#trip-description"),
  summaryDays: document.querySelector("#summary-days"),
  summaryStops: document.querySelector("#summary-stops"),
  summaryTheme: document.querySelector("#summary-theme"),
  footerTitle: document.querySelector("#footer-title"),
  footerSummary: document.querySelector("#footer-summary"),
};

const iconForType = {
  beach: "🏖️",
  volcano: "🌋",
  town: "🏘️",
  restaurant: "🍽️",
  viewpoint: "🌅",
  mountain: "⛰️",
  pools: "💧",
  forest: "🌿",
  route: "🚗",
  bus: "🚌",
  logistics: "⚠️",
  shopping: "🛒",
  hotel: "🏨",
  flight: "✈️",
  hiking: "🥾",
  landmark: "📍",
};

document.addEventListener("DOMContentLoaded", init);

async function init() {
  try {
    const response = await fetch("data.json");
    if (!response.ok) throw new Error("No se pudo cargar data.json");

    state.trip = await response.json();
    renderTrip(state.trip);
    setupSmoothLinks();
  } catch (error) {
    selectors.days.innerHTML = `
      <div class="loading-card">
        <p>No se pudo cargar el itinerario. Abre la web con un servidor local o revisa data.json.</p>
      </div>
    `;
    console.error(error);
  }
}

function renderTrip(trip) {
  selectors.title.textContent = trip.title;
  selectors.description.textContent = trip.description || "";
  selectors.description.hidden = !trip.description;
  selectors.summaryDays.textContent = trip.days.length;
  selectors.summaryStops.textContent = trip.days.reduce((total, day) => total + day.activities.length, 0);
  selectors.summaryTheme.textContent = trip.theme;
  selectors.footerTitle.textContent = trip.title;
  selectors.footerSummary.textContent = trip.summary;

  selectors.days.innerHTML = trip.days.map(renderDay).join("");
  selectors.tips.innerHTML = trip.travelTips.map(renderTip).join("");
  setupDayAccordions();
}

function renderDay(day, index) {
  const activities = day.activities.map(renderActivity).join("");
  const openClass = index === 0 ? " open" : "";
  const expanded = index === 0 ? "true" : "false";
  const dayImage = day.image
    ? `
      <figure class="day-photo">
        <img loading="lazy" src="${day.image}" alt="${day.imageAlt || day.title}">
      </figure>
    `
    : "";

  return `
    <article class="day-card${openClass}">
      <button class="day-toggle" type="button" aria-expanded="${expanded}">
        <span>
          <span class="day-meta">
            <span>Día ${index + 1}</span>
            <span>${day.date}</span>
          </span>
          <h3>${day.title}</h3>
          <p>${day.overview}</p>
        </span>
        <span class="chevron" aria-hidden="true">⌄</span>
      </button>
      <div class="day-content">
        <div class="day-inner">
          ${dayImage}
          <div class="route-strip">
            <div>
              <strong>Ruta</strong>
              <span>${day.routeInfo}</span>
            </div>
            <div>
              <strong>Parking</strong>
              <span>${day.parkingRecommendation}</span>
            </div>
          </div>
          <div class="timeline">${activities}</div>
        </div>
      </div>
    </article>
  `;
}

function renderActivity(activity) {
  const icon = activity.icon || iconForType[activity.type] || "📍";
  const parkingLink = activity.parkingLink
    ? `<a href="${activity.parkingLink}" target="_blank" rel="noopener">parking</a>`
    : "";

  return `
    <article class="activity" data-icon="${icon}">
      <div class="activity-body">
        <span class="activity-time">${activity.time}</span>
        <h3>${activity.title}</h3>
        <p>${activity.description}</p>
        <dl class="info-list">
          <div>
            <dt>Duración</dt>
            <dd>${activity.duration}</dd>
          </div>
          <div>
            <dt>Lugar</dt>
            <dd>${activity.location}</dd>
          </div>
          <div>
            <dt>Notas</dt>
            <dd>${activity.travelNotes}</dd>
          </div>
          <div>
            <dt>Parking</dt>
            <dd>${activity.parking} ${parkingLink}</dd>
          </div>
        </dl>
        <a class="map-link" href="${activity.mapsLink}" target="_blank" rel="noopener">Abrir en Google Maps</a>
      </div>
    </article>
  `;
}

function renderTip(tip) {
  return `
    <article class="tip-card">
      <span class="icon">${tip.icon}</span>
      <h3>${tip.title}</h3>
      <p>${tip.description}</p>
    </article>
  `;
}

function setupDayAccordions() {
  document.querySelectorAll(".day-card").forEach((card) => {
    const toggle = card.querySelector(".day-toggle");
    const content = card.querySelector(".day-content");

    if (card.classList.contains("open")) {
      content.style.maxHeight = `${content.scrollHeight}px`;
    }

    toggle.addEventListener("click", () => {
      const isOpen = card.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      content.style.maxHeight = isOpen ? `${content.scrollHeight}px` : "0";
    });
  });

  window.addEventListener("resize", debounce(updateOpenHeights, 140));
}

function updateOpenHeights() {
  document.querySelectorAll(".day-card.open .day-content").forEach((content) => {
    content.style.maxHeight = `${content.scrollHeight}px`;
  });
}

function setupSmoothLinks() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function debounce(callback, delay) {
  let timer;
  return (...args) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => callback(...args), delay);
  };
}
