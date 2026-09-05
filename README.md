# MedClarity — Medical Report Simplifier

> **AI-Powered Clinical Report Simplifier:** Translates complex medical laboratory terminology, diagnostic values, and technical jargon into clear, patient-friendly insights in multiple languages (English, Hindi, and Hinglish).

---

## Repository Architecture

`	ext
MedClarity/
├── backend/
│   ├── app/
│   │   ├── controllers/     # API request orchestration
│   │   ├── core/            # Configuration, security, exceptions
│   │   ├── database/        # SQLite / SQLAlchemy engine & sessions
│   │   ├── models/          # Report ORM database models
│   │   ├── routes/          # FastAPI router endpoints (/api/reports)
│   │   ├── schemas/         # Pydantic validation schemas
│   │   └── services/        # OCR, PDF extraction, medical analysis, LLM
│   ├── samples/            # Synthetic, safe non-patient demo reports
│   ├── tests/              # 26 automated unit & integration tests
│   ├── .env.example        # Backend environment variables template
│   ├── API_CONTRACT.md     # Full REST API specification
│   ├── pyproject.toml      # Modern PEP 621 Python packaging
│   ├── requirements.txt    # Python package dependencies
│   └── README.md           # Backend documentation & test commands
│
├── frontend/
│   ├── src/                # React components, pages, services, design tokens
│   ├── index.html          # Single-page application entry point
│   ├── .env.example        # Frontend environment variables template
│   ├── package.json        # Frontend NPM manifest
│   ├── package-lock.json   # NPM dependency lockfile
│   ├── vite.config.js      # Vite configuration
│   ├── tailwind.config.js  # Tailwind design system
│   ├── postcss.config.js   # PostCSS configuration
│   └── README.md           # Frontend setup and component documentation
│
└── .gitignore               # Comprehensive Git ignore rules
`

---

## Quick Start

### Backend Setup

1. **Navigate to the backend directory:**
   `ash
   cd backend
   `

2. **Configure environment:**
   `ash
   copy .env.example .env
   `

3. **Install dependencies:**
   `ash
   pip install -r requirements.txt
   `

4. **Run backend tests:**
   `ash
   pytest tests/ -v
   `

5. **Start backend API server:**
   `ash
   uvicorn app.main:app --reload --port 8000
   `

---

### Frontend Setup

1. **Navigate to the frontend directory:**
   `ash
   cd frontend
   `

2. **Configure environment:**
   `ash
   copy .env.example .env
   `

3. **Install dependencies:**
   `ash
   npm install
   `

4. **Start Vite development server:**
   `ash
   npm run dev
   `

5. **Build for production:**
   `ash
   npm run build
   `

---

## Clinical Safety & Privacy

- **Safe Synthetic Samples**: The repository contains only synthetic demo data for automated testing. No protected health information (PHI) is ever committed.
- **Git Hygiene**: Environment secrets (.env), virtual environments (.venv/), compiled caches (__pycache__/, .pytest_cache/), SQLite databases (*.db), uploads (uploads/), and node modules (
ode_modules/) are ignored via .gitignore.