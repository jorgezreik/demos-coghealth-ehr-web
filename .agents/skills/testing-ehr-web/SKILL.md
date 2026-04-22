# Testing CogHealth EHR Web

## Local Dev Setup

```bash
npm install
npm run dev  # Runs at http://localhost:5173
```

The frontend can run independently without the backend API. Forms, validation, navigation, and UI interactions are fully testable without it. API-dependent flows (data fetching, form submission success/error) require the backend at `http://localhost:8080/api`.

## Tech Stack

- React 19, TypeScript, Vite 7, Tailwind CSS 4
- react-hook-form + zod for form validation
- TanStack Query for data fetching
- Zustand for state management
- lucide-react for icons
- Custom EHR/Windows-XP-style CSS classes: `ehr-panel`, `ehr-button`, `ehr-input`, `ehr-header`, `ehr-subheader`, `ehr-toolbar`, etc.

## UI Patterns

- **Navigation**: Top toolbar with nav items (Dashboard, Patients, Schedule, Labs, Vitals, Medications, Reports, Settings)
- **Routing**: React Router v7. Routes defined in `src/App.tsx` inside `AppShell`
- **Modals**: `AlertDialog` and `ConfirmDialog` from `src/components/ui/Modal.tsx`
- **Forms**: Use `react-hook-form` with `zodResolver`. Validation errors appear inline below fields
- **Collapsible sections**: Toggle via `useState` with `ChevronDown`/`ChevronRight` icons
- **Dynamic field arrays**: `useFieldArray` from react-hook-form for repeatable form sections

## Testing Notes

- The app shows an "Error: Failed to load patients from server" dialog on pages that fetch data when no backend is running. Dismiss it with OK to continue testing UI.
- When testing form submissions without a backend, `fetch()` calls to `localhost:8080` may hang indefinitely (connection doesn't reject immediately). The error dialog will eventually appear but may take a long time. Verify validation passed (no inline errors) as proof that submission was attempted.
- Date inputs (`type="date"`) may parse typed text differently in headless/automated browsers. The value format is `YYYY-MM-DD`.
- Patient form route `/patients/new` must be defined before `/patients/:id` in the router to avoid the param route catching it.

## Key Files

- `src/App.tsx` — Routing, navigation, session management
- `src/pages/` — Page components
- `src/components/ui/` — Shared UI components (Button, Input, Card, Modal, Badge)
- `src/services/` — API service layer (`api.ts`, `patientService.ts`, etc.)
- `src/types/` — TypeScript type definitions
- `src/index.css` — Global EHR styles

## Lint & Build

```bash
npm run lint      # ESLint
npm run build     # tsc -b && vite build
npm test          # Jest
```
