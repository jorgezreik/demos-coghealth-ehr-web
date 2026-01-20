# MedChart EHR Web

Electronic Health Record System Web Application for MedChart Health Systems.

## Overview

Modern React-based frontend for the MedChart EHR system, providing a clean and intuitive interface for healthcare providers.

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- Zustand

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── patient/      # Patient-related components
│   ├── encounter/    # Encounter components
│   ├── medication/   # Medication components
│   └── provider/     # Provider components
├── pages/            # Page components
├── hooks/            # Custom React hooks
├── services/         # API services
├── stores/           # Zustand stores
├── types/            # TypeScript types
└── utils/            # Utility functions
```

## Design System

### Colors

- Primary: Teal (#0D9488 / #14B8A6)
- Secondary: Slate
- Success: Green
- Warning: Amber
- Error: Red

### Typography

- Font: Inter
- Headings: Semi-bold
- Body: Regular

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | http://localhost:8080/api |

## Contributing

See CONTRIBUTING.md for guidelines.

## License

Demo Application - Cognition AI
