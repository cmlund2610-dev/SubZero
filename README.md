# SubZero

**Precision in Data. Clarity in Design.**

SubZero is a modern SaaS customer success analytics platform built with React, providing real-time insights into client health, MRR trends, churn risk, and contract renewals.

## 🚀 Features

- **Client Portfolio Management** - Track customer health scores, engagement metrics, and account details
- **Revenue Analytics** - Monitor MRR trends, growth rates, and revenue metrics
- **Churn Risk Detection** - AI-powered identification of at-risk accounts
- **Contract Pipeline** - Manage upcoming renewals and expansion opportunities
- **Data Import** - CSV import with validation for bulk client onboarding
- **Real-time Dashboard** - Interactive widgets powered by Recharts
- **Role-based Access** - Multi-user support with permissions (Admin, Manager, Viewer)

## 🛠 Tech Stack

- **Frontend**: React 19 + Vite 7
- **UI Library**: Joy UI (@mui/joy) with custom SubZero theme
- **Routing**: React Router v6
- **Charts**: Recharts
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **State Management**: React Context (AuthContext)
- **Code Quality**: ESLint 9 with React hooks plugin

## 🎨 Brand System

SubZero uses a carefully crafted design system with:

- **Primary Coral**: `#FF6D56` - Primary actions, CTAs, key highlights
- **Neutral Gray**: `#828392` - Borders, secondary text, subtle UI elements
- **Surface Light**: `#FBFCFF` - Backgrounds, cards, elevated surfaces
- **Text Dark**: `#2E2F33` - Primary text, headings
- **Text Light**: `#FFFFFF` - Text on dark backgrounds

**Typography**: Inter font family (weights: 300, 400, 500, 700)

**Design Tokens**: See `src/assets/subzero.tokens.json` for complete token reference.

**Theme Configuration**: Joy UI theme overrides in `src/assets/theme.js`

For comprehensive brand guidelines, see [`BRAND_STYLE_GUIDE.md`](./BRAND_STYLE_GUIDE.md).

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/cmlund2610-dev/SubZero.git
cd SubZero

# Install dependencies
npm install
```

## 🔧 Development

```bash
# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🔐 Firebase Configuration

The app is pre-configured with Firebase. Configuration lives in `src/lib/firebase.js`.

**Note**: Current Firebase project uses legacy `beehive-45129` identifiers (retained for continuity). All frontend branding is SubZero.

To use Firebase emulators in development, uncomment the emulator connection code in `firebase.js`.

## 📂 Project Structure

```
src/
├── assets/           # Brand tokens, theme, logos
├── components/       # Reusable UI components
│   ├── auth/         # Authentication (Signin, Signup)
│   └── widgets/      # Dashboard widgets
├── context/          # React Context providers (Auth)
├── features/         # Feature-specific components
│   ├── dashboard/    # Dashboard features (QuickActions, StatsRow)
│   └── import/       # CSV import & validation
├── hooks/            # Custom React hooks (usePermissions)
├── layouts/          # Page layouts (AppLayout)
├── lib/              # Utilities (firebase, mappers, metrics, persist)
├── pages/            # Route pages (Home, Clients, Analytics, etc.)
├── router.jsx        # React Router configuration
└── main.jsx          # App entry point
```

## 🎯 Key Files

- **Theme**: `src/assets/theme.js` - Joy UI theme with SubZero palette
- **Tokens**: `src/assets/subzero.tokens.json` - Design token reference
- **Auth**: `src/context/AuthContext.jsx` - Firebase authentication state
- **Routing**: `src/router.jsx` - All app routes with lazy loading
- **Storage**: `src/lib/persist.js` - LocalStorage utilities (keys prefixed `subzero_*`)

## 🗂 Data Management

**LocalStorage Keys**:
- `subzero_clients` - Client portfolio data
- `subzero_auth_user` - Cached user profile
- `subzero_app_state` - Application state

**Sample Data**: `src/data/clients.sample.json` for development/demo mode

**CSV Import**: Template available at `template_example.csv`

## 🚦 Environment

No `.env` file required for basic operation. Firebase config is in code (suitable for public client apps).

For production with sensitive config, create `.env`:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
# ... etc
```

## 📝 Scripts Reference

- `npm run dev` - Start Vite dev server with HMR
- `npm run build` - Production build to `dist/`
- `npm run preview` - Serve production build locally
- `npm run lint` - Run ESLint on source files

## 🤝 Contributing

This is a private project. For questions or collaboration, contact the repository owner.

## 📄 License

Proprietary - All rights reserved.

---

**SubZero** - Built with precision. Designed for clarity.
