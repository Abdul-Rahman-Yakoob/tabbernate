# Tab Manager

A Chrome extension that lists all your open tabs in the side panel, so you can search, switch, close, and put tabs to sleep to free up memory.

![Tab Manager side panel](./docs/extension-demo.png)

## Features

- **All tabs at a glance**: every open tab across all windows, with favicons, in a side panel that stays open while you browse
- **Live updates**: the list stays in sync as tabs are opened, closed, switched, or reordered
- **Search**: filter tabs instantly by title or URL
- **Switch**: click any tab to jump to it
- **Close**: close a tab right from the list
- **Sleep**: unload a tab to free its memory without closing it; it stays in your tab strip and reloads when you open it again
- **Light and dark mode**: follows your system theme

## Tech stack

- [WXT](https://wxt.dev): web extension framework
- React + TypeScript
- Chrome Extensions API (Manifest V3): `tabs`, `sidePanel`

## Getting started

### Prerequisites

- Node.js 18+
- Google Chrome

### Run in development

```bash
npm install
npm run dev
```

This opens a Chrome window with the extension loaded and reloads it automatically when you save changes.

### Build and load manually

```bash
npm run build
```

1. Open `chrome://extensions`
2. Turn on **Developer mode** (top right)
3. Click **Load unpacked** and select the `.output/chrome-mv3` folder
4. Click the extension's toolbar icon to open the side panel

## Project structure

```
entrypoints/
  background.ts      # service worker: opens the side panel on icon click
  sidepanel/         # the side panel UI (React)
    App.tsx
    App.css
wxt.config.ts        # extension config and permissions
```

## Roadmap

- [ ] Detect stale tabs (not used in a while) and sleep or close them in bulk
- [ ] Find and merge duplicate tabs
- [ ] Group tabs by domain, with "close all" per group