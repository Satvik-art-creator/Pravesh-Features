# Pravesh

Frontend-only prototype for a college classroom management system.

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
- Google Classroom-style class home
- Create class modal on the main home page
- Opened-class workspace with teacher-view tabs
- Stream feed with posted timestamps
- Classwork with materials, assignments, upload timestamps, and due dates
- People tab with teacher, students, invite UI, and class code
- Lecture-date attendance QR flow inside each class
- Grades table with CSV export inside each class
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
