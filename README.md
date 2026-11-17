# TripNest — Travel & Hospitality Platform

<p align="center">
  <strong>One Platform. Every Journey.</strong>
</p>

<p align="center">
  A full-stack travel and hospitality platform designed to simplify how people discover travel services, connect with service providers, and manage their travel experiences.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-7-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Supabase-Backend-3FCF8E?logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Status-In%20Development-orange" alt="Project Status" />
</p>

---

## About the Project

**TripNest** is a travel and hospitality platform currently being developed with a focus on the Bangladesh market, with the potential to expand internationally.

The platform aims to bring travelers and travel service providers together through a unified experience. Users will be able to explore accommodation options, discover travel services, and manage their bookings, while service providers will have tools to manage their businesses.

TripNest is being built with a modern frontend architecture and Supabase-powered backend infrastructure, emphasizing secure authentication, database access control, and scalable feature development.

## Core Features

### Implemented

- **User Authentication**
  - User registration and login
  - Persistent authentication sessions
  - Logout functionality
  - Protected routes

- **User Profile Management**
  - View profile information
  - Update personal information
  - Upload and manage profile avatars
  - Password management

- **Vendor Onboarding**
  - Submit vendor applications
  - Provide business and contact information
  - View submitted application details
  - Track application status

- **Database Security**
  - Supabase Row Level Security (RLS)
  - User-specific profile access
  - Restricted vendor application permissions
  - Protected role management

### Planned / In Development

- Hotel listing and management
- Admin dashboard and vendor application review
- Hotel search and discovery
- Room availability and booking management
- Travel and tour services
- Appointment management
- Payment integration
- Booking notifications

*Features in this section are planned or under development and are not represented as completed functionality.*

## Technology Stack

| Technology | Purpose |
|---|---|
| React 19 | Frontend UI |
| TypeScript | Type safety |
| Vite | Development server and build tooling |
| TanStack Router | Client-side routing |
| TanStack Query | Server-state management |
| Tailwind CSS 4 | Styling |
| Supabase | Backend infrastructure |
| PostgreSQL | Relational database |
| Supabase Auth | Authentication |
| Supabase Storage | Avatar and file storage |
| React Hook Form | Form management |
| Zod | Schema validation |
| Lucide React | Icons |
| Oxlint | Code linting |

## Project Architecture

The project follows a feature-based architecture to keep the codebase organized, maintainable, and scalable.

```text
src/
├── assets/
├── components/
│   ├── navigation/
│   └── shared/
├── data/
├── features/
│   ├── appointments/
│   ├── auth/
│   │   ├── pages/
│   │   ├── authContext.ts
│   │   ├── AuthProvider.tsx
│   │   ├── authService.ts
│   │   └── useAuth.ts
│   ├── bookings/
│   ├── hotels/
│   ├── tours/
│   ├── travel/
│   └── vendor/
│       ├── pages/
│       ├── services/
│       └── types/
├── hooks/
├── layouts/
├── lib/
├── pages/
├── routes/
├── services/
└── types/
```

### Architecture Highlights

- Feature-based module organization
- Reusable navigation and layout components
- Centralized Supabase client configuration
- Authentication context for session management
- Dedicated service and type layers
- Route-based application structure

## Getting Started

Follow these instructions to run TripNest locally.

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/) (compatible with your installed Vite version)
- npm
- A Supabase project

### 1. Clone the Repository

```bash
git clone https://github.com/Ratul-007/TripNest.git
```

### 2. Navigate to the Project

```bash
cd TripNest
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Replace the placeholder values with your Supabase project credentials.

**Security Note:** Never expose your Supabase service-role key or other privileged secrets in frontend environment variables.

### 5. Start the Development Server

```bash
npm run dev
```

Open the local URL displayed in your terminal.

### 6. Build for Production

```bash
npm run build
```

### 7. Run Linting

```bash
npm run lint
```

### 8. Preview the Production Build

```bash
npm run preview
```

## Backend & Database

TripNest uses Supabase for backend infrastructure.

Current backend components include:

- Supabase Authentication
- PostgreSQL database
- Row Level Security policies
- User profile management
- Vendor application records
- Supabase Storage for profile avatars

Database access is restricted through role-based permissions and RLS policies.

The frontend uses a publishable key to connect to Supabase. Privileged operations must be handled through trusted server-side logic.

## Development Progress

| Module | Status |
|---|---|
| Frontend foundation | Implemented |
| Authentication | Implemented |
| Protected profile | Implemented |
| Profile management | Implemented |
| Avatar upload | Implemented |
| Vendor application submission | Implemented |
| Admin approval workflow | Planned |
| Hotel management | Planned |
| Hotel booking | Planned |
| Tours and travel services | Planned |
| Appointment management | Planned |
| Payment integration | Planned |

## Roadmap

- [x] Establish frontend architecture
- [x] Integrate Supabase authentication
- [x] Implement protected profile routes
- [x] Implement profile editing and avatar upload
- [x] Build vendor application submission
- [x] Configure initial database permissions and RLS
- [ ] Implement secure admin provisioning
- [ ] Build admin vendor-review workflow
- [ ] Implement hotel management
- [ ] Develop hotel search and booking
- [ ] Integrate travel and tour services
- [ ] Implement payment and notification systems
- [ ] Complete testing and production deployment

## Security Considerations

Security is an important part of TripNest's development.

- Row Level Security is enabled on protected database tables.
- Users can access and update their own profile information.
- Authenticated users cannot change their own account role through ordinary profile updates.
- Vendor applications are restricted to authenticated customers.
- Application status and review fields are protected from customer-side modification.
- Privileged administrative operations are intended to use trusted server-side authorization.

## Contributing

TripNest is currently under active development.

Contributions, suggestions, and feedback are welcome. If you would like to contribute:

1. Fork the repository.
2. Create a feature branch.
3. Implement your changes.
4. Test your changes.
5. Submit a pull request.

## Project Information

**Project:** TripNest  
**Repository:** [Ratul-007/TripNest](https://github.com/Ratul-007/TripNest)  
**Development Stage:** Active Development  
**Initial Target Market:** Bangladesh

---

<p align="center">
  <strong>TripNest</strong><br/>
  Making every journey easier to plan.
</p>