const portfolioForm = document.getElementById("portfolioForm");
const formSection = document.getElementById("formSection");
const portfolioSection = document.getElementById("portfolioSection");
const portfolioContent = document.getElementById("portfolioContent");
const backBtn = document.getElementById("backBtn");
const printBtn = document.getElementById("printBtn");
const addProjectBtn = document.getElementById("addProjectBtn");
const saveDraftBtn = document.getElementById("saveDraftBtn");
const clearBtn = document.getElementById("clearBtn");
const projectsContainer = document.getElementById("projectsContainer");
const projectTemplate = document.getElementById("projectTemplate");
const photoInput = document.getElementById("photo");
const photoPreview = document.getElementById("photoPreview");

const STORAGE_KEY = "portfolio-generator-pro-draft";

let photoData = null;

const sectorThemes = {
    Technology: {
        primary: "#205781",
        secondary: "#4f8fc0",
        soft: "#e8f4ff",
        accent: "#153b57"
    },
    Design: {
        primary: "#9f2859",
        secondary: "#ef5b8d",
        soft: "#ffe9f1",
        accent: "#6f183d"
    },
    Marketing: {
        primary: "#b3472d",
        secondary: "#ef7d57",
        soft: "#fff0e7",
        accent: "#7a2c19"
    },
    Finance: {
        primary: "#213547",
        secondary: "#4e6b85",
        soft: "#ecf3f8",
        accent: "#182531"
    },
    Healthcare: {
        primary: "#1f7a63",
        secondary: "#42b18c",
        soft: "#e8f8f1",
        accent: "#155748"
    },
    Education: {
        primary: "#3558a8",
        secondary: "#6f8ee6",
        soft: "#eef1ff",
        accent: "#243d77"
    },
    Agriculture: {
        primary: "#3c7a2d",
        secondary: "#6cbf45",
        soft: "#edf8e7",
        accent: "#28521d"
    },
    Other: {
        primary: "#5d4c7f",
        secondary: "#8e75bf",
        soft: "#f1edfb",
        accent: "#42345a"
    }
};

function createProjectItem(project = {}) {
    const fragment = projectTemplate.content.cloneNode(true);
    const projectItem = fragment.querySelector(".project-item");

    projectItem.querySelector(".project-name").value = project.name || "";
    projectItem.querySelector(".project-link").value = project.link || "";
    projectItem.querySelector(".project-role").value = project.role || "";
    projectItem.querySelector(".project-impact").value = project.impact || "";
    projectItem.querySelector(".project-description").value = project.description || "";

    projectsContainer.appendChild(fragment);
}

function getProjectData() {
    return Array.from(projectsContainer.querySelectorAll(".project-item"))
        .map((item) => ({
            name: item.querySelector(".project-name").value.trim(),
            link: item.querySelector(".project-link").value.trim(),
            role: item.querySelector(".project-role").value.trim(),
            impact: item.querySelector(".project-impact").value.trim(),
            description: item.querySelector(".project-description").value.trim()
        }))
        .filter((project) => Object.values(project).some(Boolean));
}

function updatePhotoPreview() {
    if (photoData) {
        photoPreview.innerHTML = `<img src="${photoData}" alt="Profile preview">`;
        return;
    }

    photoPreview.innerHTML = "<span>No image selected</span>";
}

function handlePhotoChange(event) {
    const [file] = event.target.files;

    if (!file) {
        photoData = null;
        updatePhotoPreview();
        return;
    }

    const reader = new FileReader();
    reader.onload = ({ target }) => {
        photoData = target.result;
        updatePhotoPreview();
    };
    reader.readAsDataURL(file);
}

function parseSkills(skillsValue) {
    return skillsValue
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);
}

function safeText(value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function normalizeUrl(url) {
    if (!url) {
        return "";
    }

    if (/^https?:\/\//i.test(url)) {
        return url;
    }

    return `https://${url}`;
}

function buildMetric(value, label) {
    if (!value) {
        return "";
    }

    return `
        <div class="metric-card">
            <strong>${safeText(value)}</strong>
            <span>${safeText(label)}</span>
        </div>
    `;
}

function buildMetaPills(data) {
    const pills = [];

    if (data.sector) {
        pills.push(`<span class="meta-pill">${safeText(data.sector)}</span>`);
    }

    if (data.location) {
        pills.push(`<span class="meta-pill">${safeText(data.location)}</span>`);
    }

    if (data.email) {
        pills.push(`<span class="meta-pill">${safeText(data.email)}</span>`);
    }

    if (data.phone) {
        pills.push(`<span class="meta-pill">${safeText(data.phone)}</span>`);
    }

    return pills.join("");
}

function buildLinks(data) {
    const links = [];

    if (data.website) {
        const website = normalizeUrl(data.website);
        links.push(`<a href="${safeText(website)}" target="_blank" rel="noreferrer">Website</a>`);
    }

    if (data.linkedin) {
        const linkedin = normalizeUrl(data.linkedin);
        links.push(`<a href="${safeText(linkedin)}" target="_blank" rel="noreferrer">LinkedIn</a>`);
    }

    return links.join("");
}

function buildHighlights(data, projects) {
    const highlights = [];

    if (data.role && data.sector) {
        highlights.push(`${data.role} working across the ${data.sector} sector.`);
    }

    if (data.yearsExperience) {
        highlights.push(`${data.yearsExperience} years of hands-on professional experience.`);
    }

    if (projects.length) {
        highlights.push(`Portfolio includes ${projects.length} featured project${projects.length > 1 ? "s" : ""}.`);
    }

    if (data.projectsCount) {
        highlights.push(`${data.projectsCount} completed or delivered projects highlighted in experience.`);
    }

    if (data.clientsCount) {
        highlights.push(`Trusted by ${data.clientsCount} clients, teams, or collaborators.`);
    }

    if (!highlights.length) {
        highlights.push("This portfolio was generated from the professional profile details provided in the form.");
    }

    return highlights.map((item) => `<li>${safeText(item)}</li>`).join("");
}

function buildProjects(projects) {
    if (!projects.length) {
        return `<div class="empty-projects">No featured projects were added yet. Use the form to showcase your strongest work.</div>`;
    }

    return projects
        .map((project) => {
            const projectLink = project.link
                ? `<a class="project-link" href="${safeText(normalizeUrl(project.link))}" target="_blank" rel="noreferrer">View project</a>`
                : "";

            return `
                <article class="project-card">
                    <h3>${safeText(project.name || "Untitled Project")}</h3>
                    ${project.role ? `<span class="project-role-line">${safeText(project.role)}</span>` : ""}
                    ${project.impact ? `<span class="project-impact-line">${safeText(project.impact)}</span>` : ""}
                    <p>${safeText(project.description || "Project details were not provided.")}</p>
                    ${projectLink}
                </article>
            `;
        })
        .join("");
}

function getTheme(sector) {
    return sectorThemes[sector] || sectorThemes.Other;
}

function setThemeVariables(theme) {
    document.documentElement.style.setProperty("--theme-primary", theme.primary);
    document.documentElement.style.setProperty("--theme-secondary", theme.secondary);
    document.documentElement.style.setProperty("--theme-soft", theme.soft);
    document.documentElement.style.setProperty("--theme-accent", theme.accent);
}

function collectFormData() {
    return {
        name: document.getElementById("name").value.trim(),
        role: document.getElementById("role").value.trim(),
        sector: document.getElementById("sector").value,
        location: document.getElementById("location").value.trim(),
        tagline: document.getElementById("tagline").value.trim(),
        description: document.getElementById("description").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        website: document.getElementById("website").value.trim(),
        linkedin: document.getElementById("linkedin").value.trim(),
        skills: document.getElementById("skills").value.trim(),
        yearsExperience: document.getElementById("yearsExperience").value.trim(),
        clientsCount: document.getElementById("clientsCount").value.trim(),
        projectsCount: document.getElementById("projectsCount").value.trim(),
        cv: document.getElementById("cv").value.trim()
    };
}

function validateForm(data) {
    if (!data.name || !data.role || !data.sector || !data.description) {
        return false;
    }

    return true;
}

function saveDraft() {
    const draft = {
        ...collectFormData(),
        photoData,
        projects: getProjectData()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}

function loadDraft() {
    const rawDraft = localStorage.getItem(STORAGE_KEY);

    if (!rawDraft) {
        createProjectItem();
        updatePhotoPreview();
        return;
    }

    try {
        const draft = JSON.parse(rawDraft);

        const fieldIds = [
            "name",
            "role",
            "sector",
            "location",
            "tagline",
            "description",
            "email",
            "phone",
            "website",
            "linkedin",
            "skills",
            "yearsExperience",
            "clientsCount",
            "projectsCount",
            "cv"
        ];

        fieldIds.forEach((id) => {
            if (typeof draft[id] === "string") {
                document.getElementById(id).value = draft[id];
            }
        });

        photoData = draft.photoData || null;
        projectsContainer.innerHTML = "";

        if (Array.isArray(draft.projects) && draft.projects.length) {
            draft.projects.forEach((project) => createProjectItem(project));
        } else {
            createProjectItem();
        }

        updatePhotoPreview();
    } catch (error) {
        console.error("Unable to load saved draft:", error);
        createProjectItem();
        updatePhotoPreview();
    }
}

function clearDraft() {
    localStorage.removeItem(STORAGE_KEY);
}

function resetFormState() {
    photoData = null;
    portfolioContent.innerHTML = "";
    projectsContainer.innerHTML = "";
    createProjectItem();
    updatePhotoPreview();
    setThemeVariables(sectorThemes.Technology);
}

function generatePortfolio() {
    const data = collectFormData();

    if (!validateForm(data)) {
        portfolioForm.reportValidity();
        return;
    }

    const projects = getProjectData();
    const skills = parseSkills(data.skills);
    const theme = getTheme(data.sector);

    setThemeVariables(theme);
    saveDraft();

    const metricsMarkup = [
        buildMetric(data.yearsExperience, "Years Experience"),
        buildMetric(data.clientsCount, "Clients / Teams Served"),
        buildMetric(data.projectsCount || String(projects.length || ""), "Projects Delivered")
    ].join("");

    const skillsMarkup = skills.length
        ? skills.map((skill) => `<span class="skill-pill">${safeText(skill)}</span>`).join("")
        : `<div class="empty-projects">Add your core skills in the form to display them here.</div>`;

    const photoSrc = photoData ||
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23dfe8f2'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='20' fill='%235c6b7a'%3EProfile%3C/text%3E%3C/svg%3E";

    portfolioContent.innerHTML = `
        <article class="portfolio-shell">
            <header class="portfolio-hero">
                <div class="portfolio-hero-top">
                    <div class="portfolio-identity">
                        <img class="portfolio-avatar" src="${photoSrc}" alt="${safeText(data.name)} profile photo">
                        <div>
                            <p class="eyebrow">Professional Portfolio</p>
                            <h1 class="portfolio-name">${safeText(data.name)}</h1>
                            <p class="portfolio-role">${safeText(data.role)}</p>
                            <div class="portfolio-meta">${buildMetaPills(data)}</div>
                            <div class="portfolio-links">${buildLinks(data)}</div>
                        </div>
                    </div>
                </div>

                ${data.tagline ? `<p class="portfolio-tagline">${safeText(data.tagline)}</p>` : ""}
                ${metricsMarkup ? `<section class="metrics-grid">${metricsMarkup}</section>` : ""}
            </header>

            <div class="portfolio-body">
                <section class="portfolio-main">
                    <section class="portfolio-block">
                        <h2>About</h2>
                        <p>${safeText(data.description)}</p>
                    </section>

                    <section class="portfolio-block">
                        <h2>Featured Projects</h2>
                        <div class="project-grid">${buildProjects(projects)}</div>
                    </section>

                    ${data.cv ? `
                        <section class="portfolio-block">
                            <h2>Experience & Background</h2>
                            <p>${safeText(data.cv)}</p>
                        </section>
                    ` : ""}
                </section>

                <aside class="portfolio-side">
                    <section class="portfolio-block">
                        <h2>Core Skills</h2>
                        <div class="skills-list">${skillsMarkup}</div>
                    </section>

                    <section class="portfolio-block">
                        <h2>Professional Highlights</h2>
                        <ul class="highlights-list">${buildHighlights(data, projects)}</ul>
                    </section>
                </aside>
            </div>

            <footer class="portfolio-footer">
                Crafted with the Portfolio Generator using HTML, CSS, and JavaScript.
            </footer>
        </article>
    `;

    formSection.classList.add("hidden");
    portfolioSection.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

photoInput.addEventListener("change", handlePhotoChange);

addProjectBtn.addEventListener("click", () => {
    createProjectItem();
});

projectsContainer.addEventListener("click", (event) => {
    if (!event.target.classList.contains("remove-project-btn")) {
        return;
    }

    const projectItems = projectsContainer.querySelectorAll(".project-item");
    if (projectItems.length === 1) {
        projectItems[0].querySelectorAll("input, textarea").forEach((field) => {
            field.value = "";
        });
        return;
    }

    event.target.closest(".project-item").remove();
});

portfolioForm.addEventListener("submit", (event) => {
    event.preventDefault();
    generatePortfolio();
});

saveDraftBtn.addEventListener("click", () => {
    saveDraft();
    saveDraftBtn.textContent = "Draft Saved";

    window.setTimeout(() => {
        saveDraftBtn.textContent = "Save Draft";
    }, 1500);
});

backBtn.addEventListener("click", () => {
    portfolioSection.classList.add("hidden");
    formSection.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
});

printBtn.addEventListener("click", () => {
    window.print();
});

clearBtn.addEventListener("click", () => {
    clearDraft();

    window.setTimeout(() => {
        resetFormState();
    }, 0);
});

document.addEventListener("input", (event) => {
    if (event.target.closest("#portfolioForm")) {
        saveDraft();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    setThemeVariables(sectorThemes.Technology);
    loadDraft();
    document.getElementById("name").focus();
});
