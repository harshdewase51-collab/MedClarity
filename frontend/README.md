# MedClarity — Frontend

Modern, accessible patient portal for the **Medical Report Simplifier** platform. Converts complex clinical lab results and diagnostic jargon into plain-English (or Hindi/Hinglish) explanations with visual reference gauges, categorized findings, and exportable reports.

## Features

- **Intuitive Upload Experience**: Drag-and-drop support for PDF lab reports, PNG, and JPG scans.
- **Multilingual Explanations**: Seamless switching between English, Hindi, and Hinglish.
- **Visual Reference Gauges**: Color-coded test status (Normal, Low, High, Critical) with reference ranges.
- **Comprehensive Findings Breakdown**: Categorized into Normal, Mild Attention, and Critical Attention.
- **Doctor Consultation Questions**: Contextual, generated questions to ask physicians.
- **Print & PDF Export**: Clean, printable report layout for consultations.
- **Audit & History**: Local review of previous analyses.

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, PostCSS
- **Icons**: Lucide React
- **Router**: React Router v6

## Getting Started

### 1. Install Dependencies

\\ash
cd frontend
npm install
\
### 2. Configure Environment

Copy the example environment file:

\\ash
copy .env.example .env
\
Set the API endpoint:
\\env
VITE_API_BASE_URL=http://localhost:8000/api/reports
\
### 3. Run Development Server

\\ash
npm run dev
\
The app will be accessible at: \http://localhost:5173
### 4. Build for Production

\\ash
npm run build
\
To preview the production build:
\\ash
npm run preview
\
## Project Structure

\frontend/
├── public/                 # Static public assets (if present)
├── src/
│   ├── components/
│   │   ├── common/         # Reusable UI (StatusBadge, ReferenceGauge, StatCard, etc.)
│   │   └── layout/         # Header, Sidebar, Navigation
│   ├── data/               # Mock reports & fallback datasets
│   ├── pages/              # Dashboard, UploadReport, ReportResults, etc.
│   ├── services/           # API integration service layer
│   ├── App.jsx             # Top-level routing and state
│   ├── index.css           # Tailwind CSS directives and custom design tokens
│   └── main.jsx            # Application entry point
├── .env.example            # Environment variables template
├── index.html              # HTML entry point
├── package.json            # Dependencies and scripts
├── postcss.config.js       # PostCSS plugins
├── tailwind.config.js      # Tailwind configuration and theme extensions
└── vite.config.js          # Vite configuration
\