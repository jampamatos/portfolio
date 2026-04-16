export function getById(id) {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`Element not found: #${id}`);
    }
    return element;
}
export function maybeGetById(id) {
    return document.getElementById(id);
}
export function queryWithin(root, selector) {
    const element = root.querySelector(selector);
    if (!element) {
        throw new Error(`Element not found for selector: ${selector}`);
    }
    return element;
}
export function maybeQueryWithin(root, selector) {
    return root.querySelector(selector);
}
export function replaceNodeContent(container, content) {
    if (typeof content === 'string') {
        container.innerHTML = content;
        return;
    }
    container.replaceChildren(content);
}
