
// ==========================================
// RESPONSIVE INTERNSHIP BOARD - FRONTEND
// Connected with Express + SQLite Backend
// ==========================================

let internships = [];

const API_URL = "https://probable-space-parakeet-j66g7576qxjhppwg-3000.app.github.dev/api/internships";

// HTML Elements
const grid = document.querySelector("#job-grid");
const searchInput = document.querySelector("#search-input");
const domainFilter = document.querySelector("#domain-filter");
const modeFilter = document.querySelector("#mode-filter");
const sortSelect = document.querySelector("#sort-select");
const resultCount = document.querySelector("#result-count");
const emptyState = document.querySelector("#empty-state");
const loadMoreButton = document.querySelector("#load-more");
const dialog = document.querySelector("#details-dialog");
const dialogContent = document.querySelector("#dialog-content");

let quickFilter = "all";
let visibleCount = 6;
let savedIds = new Set();

// Company logo colors
const tones = ["purple", "orange", "green", "blue", "pink", "yellow"];

// ==========================================
// LOAD INTERNSHIPS FROM BACKEND API
// ==========================================

async function loadInternships() {
    try {
        resultCount.textContent = "Loading internships...";

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch internships");
        }

        const result = await response.json();

        internships = result.data.map((job, index) => ({
            ...job,
            domain: job.domain === "AI/ML" ? "AI / ML" : job.domain,
            logo: job.company.charAt(0).toUpperCase(),
            tone: tones[index % tones.length],
            level: "Internship",
            posted: -job.id
        }));

        renderJobs();

    } catch (error) {
        console.error("API Error:", error);
        resultCount.textContent = "Unable to load internships. Please try again.";
        grid.replaceChildren();
        emptyState.hidden = false;
        loadMoreButton.hidden = true;
    }
}

// ==========================================
// FORMAT STIPEND
// ==========================================

const money = amount =>
    amount ? `₹${Number(amount).toLocaleString("en-IN")}/mo` : "Unpaid";

// ==========================================
// SEARCH, FILTER AND SORT
// ==========================================

function getFilteredJobs() {

    const term = searchInput.value.trim().toLowerCase();

    let result = internships.filter(job => {

        const textMatch =
            `${job.title} ${job.company} ${job.domain} ${job.description}`
            .toLowerCase()
            .includes(term);

        const domainMatch =
            domainFilter.value === "all" ||
            job.domain === domainFilter.value;

        const modeMatch =
            modeFilter.value === "all" ||
            job.mode === modeFilter.value;

        const quickMatch =
            quickFilter === "all" ||
            (
                quickFilter === "Paid"
                    ? job.stipend > 0
                    : quickFilter === "Remote"
                        ? job.mode === "Remote"
                        : job.domain.toLowerCase().includes(quickFilter.toLowerCase()) ||
                          job.title.toLowerCase().includes(quickFilter.toLowerCase())
            );

        return textMatch && domainMatch && modeMatch && quickMatch;
    });

    if (sortSelect.value === "newest") {
        result.sort((a, b) => a.posted - b.posted);
    }

    if (sortSelect.value === "stipend") {
        result.sort((a, b) => b.stipend - a.stipend);
    }

    return result;
}

// ==========================================
// DISPLAY INTERNSHIP CARDS
// ==========================================

function renderJobs() {

    const filtered = getFilteredJobs();
    const visible = filtered.slice(0, visibleCount);

    grid.replaceChildren();

    visible.forEach(job => {

        const card = document.createElement("article");
        card.className = "job-card";

        const top = document.createElement("div");
        top.className = "job-top";

        const logo = document.createElement("div");
        logo.className = `company-logo ${job.tone}`;
        logo.textContent = job.logo;

        const save = document.createElement("button");
        save.className = `save-btn ${savedIds.has(job.id) ? "saved" : ""}`;
        save.type = "button";
        save.setAttribute(
            "aria-label",
            savedIds.has(job.id) ? "Remove saved internship" : "Save internship"
        );
        save.setAttribute("aria-pressed", String(savedIds.has(job.id)));
        save.textContent = savedIds.has(job.id) ? "♥" : "♡";

        save.addEventListener("click", () => {
            savedIds.has(job.id)
                ? savedIds.delete(job.id)
                : savedIds.add(job.id);

            renderJobs();
        });

        top.append(logo, save);

        const title = document.createElement("h3");
        title.textContent = job.title;

        const company = document.createElement("div");
        company.className = "company-name";
        company.textContent = job.company;

        const tags = document.createElement("div");
        tags.className = "job-tags";

        [job.domain, job.mode, job.duration].forEach((value, index) => {

            const tag = document.createElement("span");
            tag.className = `job-tag ${
                index === 1 && job.mode === "Remote" ? "remote" : ""
            }`;

            tag.textContent = value;
            tags.append(tag);
        });

        const bottom = document.createElement("div");
        bottom.className = "job-bottom";

        const stipend = document.createElement("div");
        stipend.className = "stipend";

        const amount = document.createElement("strong");
        amount.textContent = money(job.stipend);

        const level = document.createElement("small");
        level.textContent = job.level;

        stipend.append(amount, level);

        const details = document.createElement("button");
        details.className = "details-btn";
        details.textContent = "View details →";
        details.type = "button";

        details.addEventListener("click", () => openDetails(job));

        bottom.append(stipend, details);

        card.append(top, title, company, tags, bottom);

        grid.append(card);
    });

    resultCount.textContent =
        `Showing ${visible.length} of ${filtered.length} ${
            filtered.length === 1 ? "opportunity" : "opportunities"
        }`;

    emptyState.hidden = filtered.length !== 0;
    loadMoreButton.hidden = filtered.length <= visibleCount;
}

// ==========================================
// INTERNSHIP DETAILS
// ==========================================

function openDetails(job) {

    dialogContent.replaceChildren();

    const logo = document.createElement("div");
    logo.className = `company-logo ${job.tone}`;
    logo.textContent = job.logo;

    const title = document.createElement("h2");
    title.className = "dialog-title";
    title.textContent = job.title;

    const company = document.createElement("p");
    company.className = "dialog-company";
    company.textContent = job.company;

    const description = document.createElement("p");
    description.className = "dialog-description";
    description.textContent = job.description;

    const facts = document.createElement("div");
    facts.className = "dialog-facts";

    [job.domain, job.mode, job.duration, money(job.stipend)].forEach(value => {

        const span = document.createElement("span");
        span.textContent = value;
        facts.append(span);
    });

    const note = document.createElement("p");
    note.className = "dialog-note";
    note.textContent =
        "Demo listing for this portfolio project. Verify opportunities with the organisation before sharing personal information.";

    dialogContent.append(
        logo,
        title,
        company,
        description,
        facts,
        note
    );

    if (typeof dialog.showModal === "function") {
        dialog.showModal();
    } else {
        alert(`${job.title}\n${job.company}\n${job.description}`);
    }
}

// ==========================================
// CLEAR ALL FILTERS
// ==========================================

function clearFilters() {

    searchInput.value = "";
    domainFilter.value = "all";
    modeFilter.value = "all";
    sortSelect.value = "recommended";

    quickFilter = "all";
    visibleCount = 6;

    document.querySelectorAll(".chip").forEach(chip => {
        chip.classList.toggle("active", chip.dataset.quick === "all");
    });

    renderJobs();
}

// ==========================================
// SEARCH AND FILTER EVENTS
// ==========================================

[searchInput, domainFilter, modeFilter, sortSelect].forEach(control => {

    control.addEventListener(
        control === searchInput ? "input" : "change",
        () => {
            visibleCount = 6;
            renderJobs();
        }
    );
});

document.querySelector("#search-button").addEventListener("click", () => {
    visibleCount = 6;
    renderJobs();
});

// Quick filter chips
document.querySelectorAll(".chip").forEach(chip => {

    chip.addEventListener("click", () => {

        quickFilter = chip.dataset.quick;
        visibleCount = 6;

        document.querySelectorAll(".chip").forEach(item => {
            item.classList.toggle("active", item === chip);
        });

        renderJobs();
    });
});

// Clear buttons
document.querySelector("#clear-filters")
    .addEventListener("click", clearFilters);

document.querySelector("#empty-clear")
    .addEventListener("click", clearFilters);

// Load more internships
loadMoreButton.addEventListener("click", () => {
    visibleCount += 3;
    renderJobs();
});

// ==========================================
// DETAILS DIALOG EVENTS
// ==========================================

document.querySelector("#dialog-close")
    .addEventListener("click", () => dialog.close());

dialog.addEventListener("click", event => {
    if (event.target === dialog) {
        dialog.close();
    }
});

// ==========================================
// MOBILE NAVIGATION MENU
// ==========================================

const menuToggle = document.querySelector("#menu-toggle");
const nav = document.querySelector("#nav");

menuToggle.addEventListener("click", () => {

    const open = nav.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.textContent = open ? "×" : "☰";
});

nav.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", () => {

        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
    });
});

// ==========================================
// START APPLICATION
// ==========================================

loadInternships();
