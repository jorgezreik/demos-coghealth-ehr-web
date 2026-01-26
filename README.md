# CogHealth EHR Web

React frontend for the CogHealth EHR system.

> **Full setup instructions:** See the [main README](https://github.com/cogdeasy/demos-coghealth-ehr-data#readme) for complete setup with all three repos.

## Quick Start

```bash
npm install
npm run dev
```

Requires the API to be running first.

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- TanStack Query
- Zustand

## Project Structure

```
src/
├── components/      # UI components
├── pages/           # Page components
├── services/        # API services
├── stores/          # Zustand stores
├── types/           # TypeScript types
└── utils/           # Utilities
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | http://localhost:8080/api |
