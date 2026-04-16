import { getById, queryWithin } from './dom.js';
export function cloneTemplateContent(templateId) {
    const template = getById(templateId);
    return template.content.cloneNode(true);
}
export function getTemplateElement(templateId, selector) {
    const fragment = cloneTemplateContent(templateId);
    return queryWithin(fragment, selector);
}
