# CogHealth EHR Web

Electronic Health Record System Web Application for CogHealth.

## Overview

Modern React-based frontend for the CogHealth EHR system, providing a clean and intuitive interface for healthcare providers.

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

**Prerequisites:** The API must be running first. See the [API repo](https://github.com/cogdeasy/demos-coghealth-ehr-api) for setup instructions.

```bash
# Start the API first (in the api/ directory)
cd ../api
docker-compose -f ../data/docker-compose.yml up -d  # Start PostgreSQL, Redis, etc.
JAVA_HOME=/opt/homebrew/opt/openjdk@17 mvn spring-boot:run

# Then start the web app (in the web/ directory)
cd ../web
npm run dev
```

The application will be available at `http://localhost:5173`

**Note:** The web app fetches all data from the API at `http://localhost:8080/api`. Without the API running, pages will show errors or empty content.

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
