# TaskFlow — Task Management Dashboard

A clean, production-quality task management app built as a frontend intern assignment.

Built with **Next.js 15 (App Router)** · **TypeScript** · **Tailwind CSS v4** · **Radix UI / shadcn-style components**

---

## Screenshots



### Login Page
- Centered card layout with email + password fields
- Password visibility toggle
- Auth state stored in `localStorage`; any valid email + non-empty password succeeds

### Dashboard
- Greeting header with user name derived from email
- Stats row: Total / Todo / In Progress / Completed counts
- Responsive card grid (1 → 2 → 3 columns)
- Filter bar: status dropdown, full-text search, due-date sort toggle
- Dark mode toggle (persisted to `localStorage`)
- Create / Edit / Delete / Change Status — all from the same UI

---

## Setup Steps

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Install & Run

```bash
git clone <your-repo-url>
cd taskflow
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Sign in with **any email** and **any password** — the app uses mock auth.

### Build for Production

```bash
npm run build
npm start
```

---

## Folder Structure

```
taskflow/
├── app/
│   ├── globals.css          # Tailwind v4 + CSS custom properties (design tokens)
│   ├── layout.tsx           # Root layout (metadata, body wrapper)
│   ├── page.tsx             # Login page (/)
│   └── dashboard/
│       └── page.tsx         # Main dashboard (/dashboard)
│
├── components/
│   ├── ui/                  # Reusable primitives (shadcn-style, built on Radix UI)
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   └── textarea.tsx
│   │
│   └── tasks/               # Domain-specific components
│       ├── task-card.tsx          # Individual task card with hover actions
│       ├── task-filters-bar.tsx   # Search + filter + sort controls
│       ├── task-form-modal.tsx    # Create / Edit modal with validation
│       ├── task-stats.tsx         # Summary stat cards
│       └── delete-confirm-dialog.tsx
│
├── hooks/
│   ├── use-auth.ts          # Auth state: login, logout, localStorage persistence
│   └── use-tasks.ts         # CRUD + state: tasks seeded from mock data, persisted to localStorage
│
├── lib/
│   ├── mock-data.ts         # 8 seed tasks loaded on first visit
│   └── utils.ts             # cn(), generateId(), formatDate(), isOverdue()
│
└── types/
    └── index.ts             # Task, TaskStatus, User, TaskFilters, SortOrder
```

---

## Design Decisions

### State Management
No external state library. `useTasks` and `useAuth` are custom hooks that wrap `useState` + `useEffect`, reading/writing directly to `localStorage`. This keeps the app dependency-light while still being easy to swap for a real API later (just replace the hook internals).

### Component Architecture
The `components/ui/` layer mirrors shadcn/ui's pattern — primitive Radix UI components wrapped with `cva` variants and Tailwind utilities via `cn()`. This means zero shadcn CLI dependency issues across environments.

### TypeScript Strictness
No `any` types used. All task-related types live in `types/index.ts`. Form data uses `Omit<Task, ...>` derived types to stay in sync with the base model automatically.

### Auth
Mock auth: any non-empty email + password logs you in. The user object (`{ name, email }`) is stored in `localStorage` as JSON. Protected routes check auth state on mount and redirect to `/` if unauthenticated.

### Dark Mode
Toggled by adding/removing the `dark` class on `<html>`. Preference is persisted to `localStorage`. On first visit, system preference (`prefers-color-scheme`) is respected.

### Overdue Detection
A task is flagged "Overdue" if its `dueDate` is before today **and** its status is not `completed`. This check lives in `lib/utils.ts → isOverdue()`.

---

## Bonus Features Implemented

- ✅ **Dark mode** with system preference detection + localStorage persistence
- ✅ **Overdue badges** on tasks past their due date
- ✅ **Responsive layout** — 1 col mobile, 2 col tablet, 3 col desktop
- ✅ **Empty state** with CTA when no tasks exist or no filter results
- ✅ **Form validation** — required fields, max-length, proper error messages

