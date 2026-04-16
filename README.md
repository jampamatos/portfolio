# Jampa Matos Win98 Portfolio

Personal portfolio with a Windows 98-inspired interface. The site is a static frontend built with HTML, CSS, and TypeScript, featuring draggable and resizable windows, a localized project catalog in PT/EN/ES, and a contact form powered by EmailJS.

## Overview

- Main window starts centered and is draggable/resizable on desktop
- Secondary windows support focus, drag, resize, minimize, and maximize
- Project catalog is loaded from `src/data/projects.json`
- Localized copy lives in `src/locales/en.json`, `src/locales/pt.json`, and `src/locales/es.json`
- Splash screen includes rotating loading messages
- Responsive layout adapts behavior for mobile and tablet

## Stack

- HTML5
- CSS3
- TypeScript
- `http-server` for local serving
- EmailJS for the contact form
- Optional Docker setup

## Project structure

```text
.
├── index.html
├── src/
│   ├── assets/          # images, icons, and project thumbnails
│   ├── css/             # global styles
│   ├── data/            # structured catalog data
│   ├── js/              # JavaScript generated from TypeScript
│   ├── locales/         # localized copy
│   └── ts/
│       ├── app/
│       │   ├── about.ts
│       │   ├── contact.ts
│       │   ├── localization.ts
│       │   ├── menus.ts
│       │   ├── projects.ts
│       │   ├── shell.ts
│       │   ├── splash.ts
│       │   ├── state.ts
│       │   ├── templates.ts
│       │   ├── types.ts
│       │   └── windows.ts
│       └── main.ts      # application bootstrap
├── docker/
├── package.json
└── tsconfig.json
```

## Running locally

### Prerequisites

- Node.js
- npm
- A modern browser

### Setup

1. Clone the repository:

```bash
git clone https://github.com/jampamatos/portfolio.git
cd portfolio
```

2. Install dependencies:

```bash
npm install
```

3. Compile TypeScript:

```bash
npm run build
```

4. Start a local server:

```bash
npm run start
```

5. Open:

```text
http://localhost:3000
```

Note: the current browser workflow is `npm run build` + `npm run start`. TypeScript source lives in `src/ts`, and compiled JavaScript is emitted into `src/js`.

## Docker

If you prefer running the project in a container:

```bash
docker compose -f docker/docker-compose.yaml up --build
```

Then open the URL exposed by the container.

## Content management

### Adding a new project

You no longer need to edit TypeScript constants to add a project.

1. Add the image to `src/assets/projects/`
2. Register the project in `src/data/projects.json`
3. Add `title`, `summary`, and `details` in:
   - `src/locales/pt.json`
   - `src/locales/en.json`
   - `src/locales/es.json`

Example entry for `src/data/projects.json`:

```json
{
  "id": "newProject",
  "order": 11,
  "image": "src/assets/projects/new_project.png",
  "github": "https://github.com/user/new-project",
  "live": "https://example.com"
}
```

The `id` must match the key inside `projects` in the locale files.

### Updating existing text

If the project already exists and you only want to change copy, just edit the files in `src/locales/`.

## Internal organization

- `main.ts`: application initialization
- `shell.ts`: main window controls and language/exit popups
- `windows.ts`: drag, resize, focus, minimize, maximize, and window creation
- `projects.ts`: catalog loading, project grid, and project details
- `localization.ts`: translation loading and application
- `state.ts`: shared application state

## Current features

- Main window with navigation icons
- About window
- Projects window
- Project details window
- Contact window with social badges and form
- Real-time language switching
- Proper window focus behavior
- Correct reopen behavior for already-created windows

## Credits

- Icons inspired by classic Windows 98 resources
- Badges generated with Shields.io
- Contact form powered by EmailJS

## License

MIT. See [LICENSE](./LICENSE).
