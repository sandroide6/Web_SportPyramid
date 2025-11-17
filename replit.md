# Tournament Bracket Manager

## Overview

A professional, offline-first Progressive Web App (PWA) for creating and managing tournament brackets across 30+ sports disciplines. The application enables tournament organizers to generate single-elimination brackets, manage matches in real-time, and export results in multiple formats. Built with React, TypeScript, and IndexedDB for complete offline functionality without requiring a backend server.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18+ with TypeScript for type safety and component-based development.

**Routing**: Wouter for lightweight client-side routing with three main routes:
- Home page (tournament list)
- Tournament creation page
- Tournament view/management page

**State Management**: TanStack Query (React Query) for client-side state and data synchronization with IndexedDB.

**UI Components**: Radix UI primitives with shadcn/ui design system for accessible, customizable components. The design follows a "New York" style variant with neutral color scheme and support for light/dark themes.

**Styling**: Tailwind CSS with custom theme configuration including CSS variables for dynamic theming. Typography uses Inter font family for consistent professional appearance.

### Data Storage

**Primary Storage**: IndexedDB via the `idb` library for client-side persistence. All tournament data is stored locally in the browser.

**Database Schema**:
- `tournaments` object store containing complete tournament state (participants, matches, settings)
- Indexed by creation date for efficient retrieval
- No server-side database - fully offline application

**Data Models**:
- Tournament: Contains metadata (name, sport, format), participants array, matches array, and settings
- Participant: Name, country code, seed, category/weight class
- Match: Round number, position, competitors (red/blue), winner, scores, result type (pending/score/KO/walkover/DQ)

### Core Features

**Bracket Generation**: Automatic single-elimination bracket creation with intelligent BYE placement. The algorithm calculates the next power-of-two bracket size and distributes BYEs evenly to minimize unfair advantages.

**Match Management**: Complete CRUD operations on matches with support for:
- Multiple result types (score-based, knockout, walkover, disqualification, tie)
- Red vs Blue competitor designation (common in combat sports)
- Real-time winner advancement through bracket rounds

**Import/Export**:
- Import participants from CSV, JSON, or plain text
- Export tournaments as JSON (full state) or CSV (participant lists)
- PDF generation with jsPDF for print-optimized brackets in Letter/A4/A3 formats
- All operations happen client-side using papaparse and file-saver libraries

**Dual Operating Modes**:
- Referee Mode: Full editing capabilities for tournament management
- Public Mode: Read-only view for spectators and participants

### PWA Implementation

**Service Worker**: Custom service worker (`sw.js`) implements caching strategies for offline functionality. Caches application shell and assets on install, serves from cache with network fallback.

**Manifest**: Web app manifest configured for standalone display mode, installable on mobile and desktop platforms.

**Offline-First**: All data operations occur locally in IndexedDB. No network requests required for core functionality.

### Build System

**Vite**: Modern build tool with React plugin for fast development and optimized production builds.

**Development Server**: Express.js server in development mode proxies to Vite for HMR (Hot Module Replacement).

**Production Build**: 
- Client assets compiled to `dist/public`
- Server bundled with esbuild to `dist`
- Static file serving for production deployment

**Path Aliases**: Configured shortcuts (`@/`, `@shared/`, `@assets/`) for cleaner imports.

## External Dependencies

### UI & Styling
- **Radix UI**: Headless component primitives for accessibility (@radix-ui/react-*)
- **Tailwind CSS**: Utility-first CSS framework with PostCSS
- **class-variance-authority**: Component variant management
- **clsx** / **tailwind-merge**: Conditional class name utilities

### Data Management
- **TanStack Query**: Client-side data fetching and caching
- **idb**: IndexedDB wrapper for typed database operations
- **zod**: Runtime type validation for data schemas

### Import/Export
- **papaparse**: CSV parsing library
- **jsPDF**: Client-side PDF generation
- **file-saver**: Browser file download utilities

### Third-Party Integrations
- **react-country-flag**: SVG country flag components (uses Unicode flag emojis)
- **Google Fonts**: Inter font family hosted externally
- **date-fns**: Date formatting and manipulation

### Development Tools
- **TypeScript**: Static type checking
- **Vite**: Build tool and dev server
- **tsx**: TypeScript execution for Node.js scripts
- **Drizzle Kit**: Database migration toolkit (configured but not actively used since app is offline-only)

### Database Configuration Note

The project includes Drizzle ORM configuration (`drizzle.config.ts`) and PostgreSQL/Neon dependencies, but these are not utilized in the current offline-first architecture. All data persistence happens through IndexedDB. The server-side infrastructure exists as scaffolding but is not required for application functionality.