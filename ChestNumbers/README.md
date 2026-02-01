# Athletix Chest Numbers

This project generates professional jersey card PDFs for the athletic meet.

## Structure

- `/frontend`: React + Vite application for previewing jersey cards.
- `/backend`: Node.js Express server for high-performance PDF generation.

## Getting Started

### Backend

1. `cd backend`
2. `npm install`
3. `npm run dev` (Runs with native `node --watch`)

The backend runs on `http://localhost:5001`.

### Frontend

1. `cd frontend`
2. `npm install`
3. `npm run dev`

The frontend runs on `http://localhost:5173` (or the next available port).

## PDF Generation logic

The PDF generation has been moved to the backend to avoid UI freezes in the browser when generating a large number of cards. It using `pdf-lib` and `qrcode` to generate high-quality vector-based PDFs.
