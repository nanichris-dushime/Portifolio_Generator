const portfolioForm = document.getElementById('portfolioForm');
const formSection = document.getElementById('formSection');
const portfolioSection = document.getElementById('portfolioSection');
const backBtn = document.getElementById('backBtn');
const addProjectBtn = document.getElementById('addProjectBtn');
const projectsContainer = document.getElementById('projectsContainer');
const photoInput = document.getElementById('photo');
const photoPreview = document.getElementById('photoPreview');

let photoData = null;

photoInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            photoData = event.target.result;
            photoPreview.innerHTML = `<img src="${photoData}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
});

addProjectBtn.addEventListener('click', function() {
    const projectItem = document.createElement('div');
    projectItem.className = 'project-item';
    projectItem.innerHTML = `
        <input type="text" class="project-name" placeholder="Project Name">
        <textarea class="project-description" rows="2" placeholder="Project Description"></textarea>
    `;
    projectsContainer.appendChild(projectItem);
});

projectsContainer.addEventListener('dblclick', function(e) {
    if (e.target.classList.contains('project-name') || e.target.classList.contains('project-description')) {
        const projectItem = e.target.closest('.project-item');
        if (projectsContainer.children.length > 1) {
            projectItem.remove();
        }
    }
});

portfolioForm.addEventListener('submit', function(e) {
    e.preventDefault();
    generatePortfolio();
});

function generatePortfolio() {
    const name = document.getElementById('name').value;
    const sector = document.getElementById('sector').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const description = document.getElementById('description').value;
    const cv = document.getElementById('cv').value;

    const projectItems = projectsContainer.querySelectorAll('.project-item');
    const projects = [];
    projectItems.forEach(item => {
        const projectName = item.querySelector('.project-name').value;
        const projectDescription = item.querySelector('.project-description').value;
        if (projectName || projectDescription) {
            projects.push({
                name: projectName || 'Unnamed Project',
                description: projectDescription
            });
        }
    });

    const sectorClass = getSectorClass(sector);
    const backgroundGradient = getBackgroundGradient(sector);

    const portfolioContent = document.getElementById('portfolioContent');
    let contactInfo = '';
    if (email) contactInfo += `✉️ ${email}`;
    if (email && phone) contactInfo += ' • ';
    if (phone) contactInfo += `📱 ${phone}`;

    let projectsHTML = '';
    if (projects.length > 0) {
        projectsHTML = `
            <section class="portfolio-section-content">
                <h2>Current Projects</h2>
                <div class="projects-grid">
                    ${projects.map(project => `
                        <div class="project-card">
                            <h3>${project.name}</h3>
                            <p>${project.description}</p>
                        </div>
                    `).join('')}
                </div>
            </section>
        `;
    }

    let cvHTML = '';
    if (cv.trim()) {
        cvHTML = `
            <section class="portfolio-section-content">
                <h2>Experience & CV</h2>
                <p>${cv}</p>
            </section>
        `;
    }

    const photoSrc = photoData || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150"%3E%3Crect fill="%23e0e0e0" width="150" height="150"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="14" fill="%23999"%3ENo Photo%3C/text%3E%3C/svg%3E';

    portfolioContent.innerHTML = `
        <div class="portfolio-container ${sectorClass}">
            <div class="portfolio-header">
                <div class="portfolio-photo">
                    <img src="${photoSrc}" alt="Profile Photo">
                </div>
                <div class="portfolio-info">
                    <h1>${name}</h1>
                    <p class="sector">${sector}</p>
                    <p class="contact-info">${contactInfo}</p>
                </div>
            </div>

            <section class="portfolio-section-content">
                <h2>About</h2>
                <p>${description}</p>
            </section>

            ${cvHTML}
            ${projectsHTML}
        </div>
    `;

    document.body.style.background = backgroundGradient;

    formSection.style.display = 'none';
    portfolioSection.style.display = 'block';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function getSectorClass(sector) {
    const sectorMap = {
        'Technology': 'tech',
        'Design': 'design',
        'Marketing': 'marketing',
        'Finance': 'finance',
        'Healthcare': 'healthcare',
        'Education': 'education',
        'Agriculture': 'agriculture'
    };
    return sectorMap[sector] || 'default';
}

function getBackgroundGradient(sector) {
    const backgroundMap = {
        'Technology': 'linear-gradient(135deg, #0066cc 0%, #004499 100%)',
        'Design': 'linear-gradient(135deg, #ff6b9d 0%, #ff4757 100%)',
        'Marketing': 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
        'Finance': 'linear-gradient(135deg, #2c3e50 0%, #1a252f 100%)',
        'Healthcare': 'linear-gradient(135deg, #27ae60 0%, #1e8449 100%)',
        'Education': 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
        'Agriculture': 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)'
    };
    return backgroundMap[sector] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
}

backBtn.addEventListener('click', function() {
    portfolioSection.style.display = 'none';
    formSection.style.display = 'block';
    document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('name').focus();
});