# Pravesh

Frontend-only prototype for a college teacher admin system.

## Scope

This repository currently contains only the React frontend design. There is no
real authentication, database, QR generation, file upload, attendance marking, or
backend API integration yet.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React icons

## Features

- Login-only landing page
- Teacher dashboard
- Class and student data view
- Attendance QR flow mockup
- File storage and assignment upload design
- Marks table with CSV export
- Responsive desktop sidebar and mobile drawer

## Project Structure

```text
src/
  components/
    common/       Reusable UI components
    layout/       App shell, sidebar, header
  config/         Navigation and app-level config
  data/           Mock frontend data
  pages/          Screen-level components
  types.ts        Shared TypeScript types
```

## Scripts

```bash
npm install
npm run dev
npm run build
npm run lint
```
