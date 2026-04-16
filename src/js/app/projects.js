import { TITLE_KEYS, WINDOW_KEYS } from './constants.js';
import { maybeQueryWithin, queryWithin } from './dom.js';
import { getCurrentText, getNestedValue } from './localization.js';
import { bindWindowMenu } from './menus.js';
import { getProjects, getManagedWindow } from './state.js';
import { getTemplateElement } from './templates.js';
import { bringToFront, createWindow, isMobileView, updateWindowTitle } from './windows.js';
function createProjectBadge(label, url, className) {
    const badge = document.createElement('a');
    badge.href = url;
    badge.target = '_blank';
    badge.rel = 'noopener noreferrer';
    badge.classList.add('badge', className);
    badge.textContent = label;
    return badge;
}
function renderProjectDetails(windowElement, project) {
    const imageElement = maybeQueryWithin(windowElement, '.project-image');
    const titleElement = maybeQueryWithin(windowElement, '.project-title');
    const descriptionElement = maybeQueryWithin(windowElement, '.project-description');
    const linksElement = maybeQueryWithin(windowElement, '.project-link');
    if (imageElement) {
        imageElement.src = project.image;
        imageElement.alt = project.title;
    }
    if (titleElement) {
        titleElement.textContent = project.title;
    }
    if (descriptionElement) {
        descriptionElement.textContent = project.details;
    }
    if (linksElement) {
        linksElement.replaceChildren();
        if (project.github) {
            linksElement.appendChild(createProjectBadge('Check it on GitHub', project.github, 'github-badge'));
        }
        if (project.live) {
            linksElement.appendChild(createProjectBadge('Check it Live', project.live, 'live-badge'));
        }
    }
    updateWindowTitle(windowElement, project.title);
}
function buildProjectCard(project) {
    const card = document.createElement('article');
    card.className = 'grid-item';
    card.dataset.projectId = project.id;
    const image = document.createElement('img');
    image.src = project.image;
    image.alt = project.title;
    const title = document.createElement('h4');
    title.textContent = project.title;
    const summary = document.createElement('p');
    summary.textContent = project.summary;
    card.append(image, title, summary);
    card.addEventListener('click', () => {
        openProjectDetails(project);
    });
    return card;
}
function renderProjectGrid(windowElement) {
    const grid = queryWithin(windowElement, '.project-grid');
    grid.replaceChildren(...getProjects().map(buildProjectCard));
}
export async function fetchProjectCatalog() {
    const response = await fetch('src/data/projects.json');
    if (!response.ok) {
        throw new Error('Could not load project catalog.');
    }
    return response.json();
}
export function buildProjects(projectCatalog, translations) {
    const sortedCatalog = [...projectCatalog].sort((left, right) => (left.order ?? Number.MAX_SAFE_INTEGER) - (right.order ?? Number.MAX_SAFE_INTEGER));
    return sortedCatalog.map((projectDefinition) => ({
        id: projectDefinition.id,
        title: getNestedValue(translations, `projects.${projectDefinition.id}.title`) ?? projectDefinition.id,
        summary: getNestedValue(translations, `projects.${projectDefinition.id}.summary`) ?? '',
        details: getNestedValue(translations, `projects.${projectDefinition.id}.details`) ?? '',
        image: projectDefinition.image,
        github: projectDefinition.github,
        live: projectDefinition.live,
    }));
}
export function refreshProjectWindows() {
    const projectsWindow = getManagedWindow(WINDOW_KEYS.projects);
    if (projectsWindow) {
        updateWindowTitle(projectsWindow, getCurrentText(TITLE_KEYS.projects, 'Projects'));
        renderProjectGrid(projectsWindow);
    }
    document.querySelectorAll('.project-details-window').forEach((windowElement) => {
        const projectId = windowElement.dataset.projectId;
        if (!projectId) {
            return;
        }
        const project = getProjects().find((item) => item.id === projectId);
        if (!project) {
            return;
        }
        renderProjectDetails(windowElement, project);
    });
}
export function openProjectsWindow() {
    const existingWindow = getManagedWindow(WINDOW_KEYS.projects);
    if (existingWindow) {
        renderProjectGrid(existingWindow);
        bringToFront(existingWindow);
        return;
    }
    const content = getTemplateElement('projects-template', '.projects-window');
    const windowElement = createWindow({
        key: WINDOW_KEYS.projects,
        title: getCurrentText(TITLE_KEYS.projects, 'Projects'),
        titleKey: TITLE_KEYS.projects,
        content,
        initialWidth: 800,
        initialHeight: 600,
    });
    if (!windowElement) {
        return;
    }
    windowElement.id = 'projects-window';
    bindWindowMenu(windowElement);
    renderProjectGrid(windowElement);
}
export function openProjectDetails(project) {
    const windowKey = `${WINDOW_KEYS.projectDetailsPrefix}:${project.id}`;
    const existingWindow = getManagedWindow(windowKey);
    if (existingWindow) {
        bringToFront(existingWindow);
        return;
    }
    const content = getTemplateElement('project-details-template', '.project-details-content');
    const windowElement = createWindow({
        key: windowKey,
        title: project.title,
        content,
        initialWidth: 800,
        initialHeight: 500,
        showMenuBar: false,
        showMinMax: false,
        className: 'project-details-window',
        onClose: () => {
            if (isMobileView()) {
                openProjectsWindow();
            }
        },
    });
    if (!windowElement) {
        return;
    }
    windowElement.dataset.projectId = project.id;
    renderProjectDetails(windowElement, project);
    bringToFront(windowElement);
}
