export interface Project {
    id: string;
    title: string;
    summary: string;
    details: string;
    image: string;
    github?: string;
    live?: string;
}

export interface ProjectCatalogEntry {
    id: string;
    order?: number;
    image: string;
    github?: string;
    live?: string;
}

export type TranslationDictionary = Record<string, unknown>;

export interface ManagedWindowOptions {
    key?: string;
    title: string;
    titleKey?: string;
    content: string | Node;
    initialWidth?: number;
    initialHeight?: number;
    showMenuBar?: boolean;
    showMinMax?: boolean;
    className?: string;
    onClose?: (windowElement: HTMLElement) => void;
}

export interface WindowState {
    isMinimized: boolean;
    isMaximized: boolean;
}
