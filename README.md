# Hitung Tabung

"Hitung Tabung" is a web-based application built with [Next.js](https://nextjs.org/) designed to assist users in performing cylinder volume calculations efficiently.

## Features

- **Intuitive Interface:** Easy navigation between different calculation modes.
- **Responsive Design:** Optimized for mobile and desktop screens.
- **Progressive Web App (PWA):** Installable as a standalone app with offline support.
- **Calculation Modes:** Supports various input scenarios for cylinder volume calculations.

## Project Structure

- `app/`: Main application directory containing routes and components.
  - `components/`: Reusable UI components.
  - `hooks/`: Custom React hooks for navigation and interaction.
  - `standard/`, `target/`, `emergency/`: Specific calculation modes and features.
- `public/`: Static assets including icons and manifest files for PWA capabilities.
- `scripts/`: Utility scripts for asset generation.

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd hitung-tabung
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **PWA:** Enabled for better mobile experience

## Deployment

This project is optimized for deployment on the [Vercel Platform](https://vercel.com/new).
