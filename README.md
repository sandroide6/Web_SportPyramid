# 🏆 Tournament Bracket Manager

A professional, offline-first PWA for creating and managing tournament brackets across 30+ sports disciplines.

## ✨ Features

### Core Functionality
- **Multi-Sport Support**: 30+ sports including boxing, MMA, tennis, soccer, chess, and more
- **Bracket Generation**: Automatic single-elimination bracket creation with BYE placement
- **Match Management**: Complete match editing with multiple result types (Score, KO, Walkover, DQ)
- **Professional Visualization**: Red vs Blue competitor layout with country flags and categories
- **Dual Modes**: Referee mode (full editing) and Public mode (read-only viewing)

### Data Management
- **Import Formats**: CSV, JSON, and text import for bulk participant addition
- **Export Formats**: 
  - JSON (complete tournament state)
  - PDF (print-optimized brackets in Letter/A4/A3)
  - CSV (participant lists)
- **Offline Storage**: IndexedDB-based local persistence
- **Auto-save**: Automatic saving of all changes

### PWA Features
- **100% Offline**: Works without internet connection
- **Installable**: Can be installed as standalone app on any device
- **Responsive**: Optimized for mobile, tablet, and desktop
- **Dark Mode**: Beautiful light and dark themes

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ installed
- npm package manager

### Installation

1. Clone or download this repository

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5000`

## 📱 Building for Production

### Web Deployment

Build the optimized production bundle:
```bash
npm run build
```

The built files will be in the `dist` directory. Deploy these to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Any web server

### Android (TWA/PWA)

1. **Install as PWA** (easiest):
   - Open the app in Chrome on Android
   - Tap the menu (3 dots)
   - Select "Install app" or "Add to Home Screen"

2. **Build as TWA** (Trusted Web Activity):
   - Use [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap)
   - Configure your domain and generate Android app
   - Publish to Google Play Store

### iOS

1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. The app will function as a standalone application

## 🎯 Usage Guide

### Creating a Tournament

1. Click "New Tournament" on the home page
2. Enter tournament details:
   - Name (e.g., "World Championship 2024")
   - Select sport from 30+ options
   - Choose format (currently single-elimination)
3. Add participants:
   - Manual entry with name, country, and category
   - Bulk import via CSV/JSON
4. Click "Create Tournament" to generate bracket

### Managing Matches

**Referee Mode** (editing enabled):
- Click any match card to edit
- Select winner by clicking competitor
- Choose result type: Score, KO, Walkover, DQ
- Enter scores for point-based sports
- Manually adjust competitors if needed

**Public Mode** (read-only):
- Clean viewing experience
- Share bracket with spectators
- Export and print options available

### Importing Participants

**CSV Format:**
```csv
name,country,seed,category
John Doe,US,1,Heavyweight
Jane Smith,GB,2,Heavyweight
```

**JSON Format:**
```json
[
  {
    "name": "John Doe",
    "country": "US",
    "seed": 1,
    "category": "Heavyweight"
  }
]
```

**Text Format** (one per line):
```
John Doe
Jane Smith
Mike Johnson
```

### Exporting Data

1. Click the Export button in tournament view
2. Choose format:
   - **JSON**: Complete tournament state with all data
   - **PDF**: Print-ready bracket visualization
   - **CSV**: Participant list with stats
3. Select paper size for PDF (Letter/A4/A3)
4. Download and save

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript
- **Routing**: Wouter
- **Styling**: Tailwind CSS + Shadcn UI
- **State**: TanStack Query (React Query v5)
- **Storage**: IndexedDB (via idb library)
- **PDF**: jsPDF
- **CSV**: PapaParse
- **Build**: Vite

### Project Structure
```
├── client/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Route pages
│   │   ├── lib/              # Utilities and helpers
│   │   └── hooks/            # Custom React hooks
│   └── public/               # Static assets
├── shared/
│   └── schema.ts             # TypeScript types and validation
└── server/                   # Development server only
```

## 🎨 Design Philosophy

- **Professional First**: Designed for official tournaments and leagues
- **Offline Capable**: No server required, works anywhere
- **User-Friendly**: Intuitive for both organizers and spectators
- **Print-Ready**: Export beautiful PDF brackets
- **Accessible**: WCAG compliant with proper contrast and navigation

## 🔧 Configuration

### Supported Sports

The app includes 30+ pre-configured sports:
- Combat: Boxing, MMA, Karate, Taekwondo, Judo, Wrestling, Kickboxing, Muay Thai
- Racket: Tennis, Badminton, Table Tennis, Squash, Padel
- Team: Soccer, Basketball, Volleyball, Handball, Rugby, Hockey, Baseball, American Football
- Individual: Chess, Athletics, Swimming, Cycling, Gymnastics, Golf, Archery, Fencing, Bowling, Darts, Billiards
- E-Sports
- Custom/Other

### Tournament Formats

Currently supported:
- Single Elimination

Coming soon:
- Double Elimination
- Round Robin
- Swiss System

## 📄 License

This project is open source and available for personal and commercial use.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 💡 Tips & Best Practices

1. **Backup Tournaments**: Export to JSON regularly for backup
2. **Large Tournaments**: Use CSV import for 50+ participants
3. **Printing**: Use PDF export with A3 for large brackets
4. **Mobile Use**: Install as PWA for better mobile experience
5. **Offline Mode**: All data stored locally, works without internet

## 🐛 Troubleshooting

**Tournament not saving?**
- Check browser storage permissions
- Clear browser cache and reload
- Export to JSON as backup

**PDF export not working?**
- Ensure popup blocker is disabled
- Try different browser
- Use smaller bracket sizes for better formatting

**App not installing?**
- Use Chrome/Edge/Safari
- Ensure site is served over HTTPS
- Check browser PWA support

## 📞 Support

For issues, questions, or feature requests, please open an issue on the project repository.

---

Built with ❤️ for tournament organizers worldwide
