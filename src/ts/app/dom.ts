export function getById<T extends HTMLElement>(id: string): T {
    const element = document.getElementById(id);

    if (!element) {
        throw new Error(`Element not found: #${id}`);
    }

    return element as T;
}

export function maybeGetById<T extends HTMLElement>(id: string): T | null {
    return document.getElementById(id) as T | null;
}

export function queryWithin<T extends Element>(root: ParentNode, selector: string): T {
    const element = root.querySelector(selector);

    if (!element) {
        throw new Error(`Element not found for selector: ${selector}`);
    }

    return element as T;
}

export function maybeQueryWithin<T extends Element>(root: ParentNode, selector: string): T | null {
    return root.querySelector(selector) as T | null;
}

export function replaceNodeContent(container: HTMLElement, content: string | Node): void {
    if (typeof content === 'string') {
        container.innerHTML = content;
        return;
    }

    container.replaceChildren(content);
}
