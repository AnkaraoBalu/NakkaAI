# Nakka landing page

React landing page built with Vite, React Router, and Tailwind CSS.

```sh
npm install
npm run dev
```

Use `npm run build` for production output in `dist/`, and `npm run preview` to check that build locally.

## Structure

- `main.jsx` mounts the application and loads global styles.
- `AppRouter.js` defines the home route and the not-found route.
- `components/` contains the shared site layout, header, footer, and copy button.
- `home/Home.js` composes the ten homepage sections and owns shared provider selection.
- `home/components/` contains one component per page section; `editor/` holds the three code samples.
- `home/hooks/` contains editor chat and terminal simulation state, including timer cleanup.
- `home/data/` contains provider presentation settings.
- `styles/global.css` contains base styles and animations.
- `tailwind.config.js` contains the original design tokens and source scanning paths.
- `index.html` and `code.html` are small entry documents for the same app. Edit page content in the components.
- `DESIGN.md`, `screen.png`, and `icon.png` are the supplied design references/assets.

Configure production hosting to serve `index.html` for application paths so BrowserRouter can handle direct links. Both `/` and `/code.html` are built entry points. The editor and terminal are local demos; the existing placeholder links and external branding assets still need final product destinations/assets before launch.
