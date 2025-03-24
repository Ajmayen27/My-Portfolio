// Project data (in-memory storage)
let projects = [
    { id: 1, title: "Project 1", description: "A web app built with HTML, CSS, and JS.", category: "web", link: "", image: "" },
    { id: 2, title: "Project 2", description: "A design-focused project.", category: "design", link: "", image: "" }
];
let editingProjectId = null;

// DOM Elements
const projectsContainer = document.getElementById('projects-container');
const modal = document.getElementById('project-modal');
const closeModal = document.getElementById('close-modal');
const projectForm = document.getElementById('project-form');
const modalTitle = document.getElementById('modal-title');
const addProjectBtn = document.getElementById('add-project-btn');

// Smooth scrolling
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    });
});

// Render projects
function renderProjects(filter = 'all') {
    projectsContainer.innerHTML = '';
    projects.forEach(project => {
        if (filter === 'all' || project.category === filter) {
            const projectDiv = document.createElement('div');
            projectDiv.classList.add('project');
            projectDiv.setAttribute('data-category', project.category);
            projectDiv.setAttribute('data-id', project.id);
            // Set background image if available
            if (project.image) {
                projectDiv.style.backgroundImage = `url(${project.image})`;
            }
            projectDiv.innerHTML = `
                <h2>${project.title}</h2>
                <p>${project.description}</p>
                ${project.link ? `<a href="${project.link}" target="_blank" class="project-link">View Project</a>` : ''}
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            `;
            projectsContainer.appendChild(projectDiv);
        }
    });
    attachProjectEventListeners();
}

// Initial render
renderProjects();

// Project filtering
document.querySelectorAll('.project-filter button').forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        renderProjects(filter);
    });
});

// Open modal for adding
addProjectBtn.addEventListener('click', () => {
    editingProjectId = null;
    modalTitle.textContent = 'Add Project';
    projectForm.reset();
    modal.style.display = 'flex';
});

// Close modal
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// CRUD Operations
projectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('project-title').value;
    const description = document.getElementById('project-desc').value;
    const category = document.getElementById('project-category').value;
    const link = document.getElementById('project-link').value;
    const imageInput = document.getElementById('project-image');
    let image = '';

    // Handle image file
    if (imageInput.files && imageInput.files[0]) {
        image = URL.createObjectURL(imageInput.files[0]);
    }

    if (editingProjectId) {
        // Update
        projects = projects.map(project =>
            project.id === editingProjectId ? { ...project, title, description, category, link, image: image || project.image } : project
        );
    } else {
        // Create
        const newProject = {
            id: Date.now(),
            title,
            description,
            category,
            link,
            image
        };
        projects.push(newProject);
    }

    renderProjects();
    modal.style.display = 'none';
});

// Edit and Delete event listeners
function attachProjectEventListeners() {
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.parentElement.getAttribute('data-id'));
            const project = projects.find(p => p.id === id);
            editingProjectId = id;
            modalTitle.textContent = 'Edit Project';
            document.getElementById('project-title').value = project.title;
            document.getElementById('project-desc').value = project.description;
            document.getElementById('project-category').value = project.category;
            document.getElementById('project-link').value = project.link || '';
            // Note: File input cannot be pre-filled for security reasons
            modal.style.display = 'flex';
        });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.parentElement.getAttribute('data-id'));
            projects = projects.filter(p => p.id !== id);
            renderProjects();
        });
    });
}

// Contact form
document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();
    alert('Thank you for your message! (This is a demo)');
    this.reset();
});

// Fade-in animation
const sections = document.querySelectorAll('section');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.2 });

sections.forEach(section => {
    section.style.opacity = 0;
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'opacity 0.5s, transform 0.5s';
    observer.observe(section);
});