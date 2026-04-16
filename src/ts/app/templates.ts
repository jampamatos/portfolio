import { getById, queryWithin } from './dom.js';

export function cloneTemplateContent(templateId: string): DocumentFragment {
    const template = getById<HTMLTemplateElement>(templateId);
    return template.content.cloneNode(true) as DocumentFragment;
}

export function getTemplateElement<T extends HTMLElement>(templateId: string, selector: string): T {
    const fragment = cloneTemplateContent(templateId);
    return queryWithin<T>(fragment, selector);
}
