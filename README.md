# Dream Journal AI

A voice-first AI-powered dream journal application that helps users record, transcribe, analyze, and understand their dreams. Built with Next.js 15, featuring real-time voice transcription, Jungian & Freudian psychological analysis, and privacy-focused encrypted storage.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [Pricing Tiers](#pricing-tiers)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Dream Journal AI transforms the ephemeral nature of dreams into a structured, searchable database of your subconscious. Using advanced speech-to-text technology and AI-powered analysis, users can capture dreams immediately upon waking through voice recording, receive Jungian and Freudian psychological interpretations, and discover patterns across their dream history.

The application prioritizes privacy with encrypted storage and follows a minimalist "Editorial Dark Mode" design philosophy for a premium user experience.

---

## Features

### Core Functionality
- **Voice-First Recording**: Capture dreams through voice input with real-time transcription using Groq Whisper
- **AI Dream Analysis**: Automatic extraction of themes, emotions, symbols, people, and settings using LLaMA
- **Jungian & Freudian Interpretation**: Deep psychological analysis with archetypes, shadow self, wish fulfillment insights
- **Pattern Recognition**: Identify recurring themes and symbols across your dream history
- **Similar Dream Discovery**: Vector-based semantic search using Jina AI embeddings to find dreams with similar content
- **Actionable Insights**: Personalized advice based on dream analysis

### User Experience
- **Dream Calendar**: Visual monthly calendar showing dream activity with heatmap-style display
- **Interactive Demo**: Try the app with sample dreams before signing up
- **Editorial Dark/Light Mode**: Premium interface with refined typography and theme toggle
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **PWA Support**: Install as a native app on mobile devices with offline page
- **Weekly Insights Dashboard**: Visualized analytics with multiple chart types:
  - Theme frequency bar charts
  - Emotion distribution pie charts
  - Dream activity timeline
  - Mood trend line charts
  - Pattern cards with connected dreams
- **Export Options**: Download dreams as PDF, Markdown, or JSON files (single or bulk)
- **Pre-Sleep Tracking**: Log mood, stress level, and sleep quality before sleep
- **Search & Filter**: Full-text search across all dreams and themes

### Privacy and Security
- **Encrypted Storage**: All dream entries encrypted at rest
- **OAuth Authentication**: Secure sign-in via Google
- **Data Ownership**: Full export and account deletion capabilities
- **GDPR Compliant**: User data controls, privacy policy, and terms of service

---

## Technology Stack

### Frontend
- **Framework**: Next.js 15 (App Router) with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI / Shadcn UI
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **State Management**: Zustand

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Vector Store**: pgvector extension for semantic search
- **Authentication**: NextAuth.js v5 (Auth.js)

### AI/ML Services
- **Speech-to-Text**: Groq Whisper (whisper-large-v3-turbo)
- **Text Analysis**: Groq LLaMA 3.3 70B
- **Embeddings**: Jina AI (jina-embeddings-v3, 1024 dimensions)

### Infrastructure
- **Deployment**: Vercel
- **Database Hosting**: Neon PostgreSQL (with pgvector)
- **CDN**: Vercel Edge Network

---

## Prerequisites

- Node.js 18.x or higher
- npm or yarn
- PostgreSQL database with pgvector extension (Neon recommended)
- API keys for:
  - Groq (transcription & analysis)
  - Jina AI (embeddings)
  - Google OAuth (authentication)

---

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/dream-journal.git
   cd dream-journal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Configure environment variables**
   
   Copy the example environment file and fill in your values:
   ```bash
   cp .env.example .env
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# Authentication
AUTH_SECRET="your-auth-secret-key"
GOOGLE_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"

# AI Services
GROQ_API_KEY="your-groq-api-key"
JINA_API_KEY="your-jina-api-key"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"
```

### Variable Descriptions

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string with pgvector support |
| `AUTH_SECRET` | Yes | Random secret for NextAuth.js session encryption |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth 2.0 Client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth 2.0 Client Secret |
| `GROQ_API_KEY` | Yes | Groq API key for Whisper transcription and LLaMA analysis |
| `JINA_API_KEY` | Yes | Jina AI API key for generating embeddings |

---

## Usage

### Recording a Dream

1. Navigate to the Dashboard
2. Click "New Entry" or the floating microphone button
3. Speak your dream narrative naturally
4. Optionally add pre-sleep metrics (mood, stress, sleep quality)
5. The system will transcribe and analyze automatically
6. Review the generated analysis, themes, and psychological interpretation

### Viewing Dream Details

1. Click on any dream card in the dashboard
2. View full transcript and AI interpretation
3. Expand "Show psychological analysis" for Jungian/Freudian insights
4. See similar dreams based on semantic similarity
5. Export individual dream as PDF or Markdown

### Viewing Insights

1. Navigate to the Insights page
2. View weekly reports, pattern charts, and emotional trends
3. Generate comprehensive weekly summaries with AI
4. Track recurring themes and symbols over time

### Exporting Data

1. Open Settings
2. Use "Export All Dreams" for complete backup (PDF, Markdown, or JSON)
3. Individual dreams can be exported from their detail pages
4. Export limits: PDF (500 dreams), MD/JSON (5,000 dreams)

---

## Project Structure

```
dream-journal/
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets & PWA icons
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── api/               # API route handlers
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── dreams/        # Dream CRUD & analysis
│   │   │   ├── patterns/      # Pattern detection
│   │   │   ├── reports/       # Weekly reports
│   │   │   ├── stats/         # Statistics
│   │   │   ├── transcribe/    # Voice transcription
│   │   │   ├── export/        # Export functionality
│   │   │   └── user/          # User management
│   │   ├── calendar/          # Dream calendar view
│   │   ├── dashboard/         # Main journal view
│   │   ├── demo/              # Interactive demo (no auth required)
│   │   ├── dreams/[id]/       # Individual dream detail
│   │   ├── insights/          # Analytics dashboard
│   │   ├── login/             # Authentication page
│   │   ├── offline/           # Offline fallback page (PWA)
│   │   ├── settings/          # User settings
│   │   ├── privacy/           # Privacy policy
│   │   ├── terms/             # Terms of service
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── landing/           # Landing page sections (11 components)
│   │   ├── ui/                # Shadcn UI components (15 components)
│   │   ├── analysis-panel.tsx # Dream analysis display
│   │   ├── dream-calendar.tsx # Monthly calendar with heatmap
│   │   ├── dream-card.tsx     # Dream list item
│   │   ├── dream-form.tsx     # Dream creation form
│   │   ├── error-boundary.tsx # Error handling wrapper
│   │   ├── navigation.tsx     # App navigation
│   │   ├── pattern-chart.tsx  # Charts (Theme, Emotion, Activity, Mood)
│   │   ├── voice-recorder.tsx # Recording interface
│   │   └── theme-toggle.tsx   # Dark/light mode toggle
│   ├── lib/
│   │   ├── prisma.ts          # Database client
│   │   ├── auth.ts            # Authentication config
│   │   ├── groq.ts            # Groq AI integration
│   │   ├── jina.ts            # Jina embeddings
│   │   ├── patterns.ts        # Pattern detection logic
│   │   ├── store.ts           # Zustand state management
│   │   ├── logger.ts          # Logging utility
│   │   └── utils.ts           # Utility functions
│   └── styles/
│       └── globals.css        # Global styles
├── .env                       # Environment variables
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies and scripts
```

---

## API Reference

### Dreams

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dreams` | List dreams (paginated) |
| POST | `/api/dreams` | Create a new dream entry |
| GET | `/api/dreams/[id]` | Get a specific dream |
| DELETE | `/api/dreams/[id]` | Delete a dream |
| POST | `/api/dreams/[id]/analyze` | Trigger AI analysis |
| GET | `/api/dreams/[id]/similar` | Find semantically similar dreams |

### Transcription

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/transcribe` | Transcribe audio to text using Groq Whisper |

### Insights

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/patterns` | Get theme and symbol patterns |
| GET | `/api/stats` | Get dream statistics |
| GET | `/api/reports/weekly` | Get weekly report data |
| POST | `/api/reports/weekly` | Generate AI weekly summary |

### Export

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/export/pdf` | Export dreams as PDF (max 500) |
| POST | `/api/export/md` | Export dreams as Markdown (max 5,000) |
| POST | `/api/export/json` | Export dreams as JSON (max 5,000) |

### User

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user` | Get current user profile |
| DELETE | `/api/user` | Delete user account and all data |

---

## Database Schema

### Core Models

**User**
- Linked to Google OAuth authentication
- Stores preferences and account metadata
- Cascade deletion for all related data

**Dream**
- Transcript text content
- Recording timestamp
- Pre-sleep metrics (mood, stress, sleep quality)
- Vector embedding for semantic search (1024 dimensions)
- Embedding status tracking

**DreamAnalysis**
- Extracted themes, emotions, symbols
- People and settings identified
- Nightmare and lucid dream flags
- Vividness score (1-10)
- AI-generated summary
- **Jungian/Freudian interpretation** (JSON)
  - Jungian perspective (archetypes, shadow, individuation)
  - Freudian perspective (wish fulfillment, unconscious desires)
  - Actionable advice

**Pattern**
- Recurring theme tracking
- User-specific pattern data
- Confidence scoring

---

## Authentication

The application uses NextAuth.js v5 with Google OAuth:

- **Google OAuth 2.0**: Primary authentication method
- **JWT Strategy**: Stateless session management
- **Secure Cookies**: HTTP-only, secure session cookies

### Setting Up OAuth

1. **Google**: Create credentials at [Google Cloud Console](https://console.cloud.google.com/)
   - Add authorized redirect URI: `https://yourdomain.com/api/auth/callback/google`
   - Enable Google+ API

---

## Pricing Tiers

### Dreamer (Free)
- Unlimited dream entries
- Voice transcription
- Basic AI analysis
- Export: JSON & Markdown (50 dreams)

### Oneironaut ($12/mo)
- Everything in Dreamer
- Jungian & Freudian analysis
- Similar dreams detection
- Unlimited pattern insights
- Weekly AI reports
- Export: PDF (500), JSON/MD (5,000)

*Note: Currently all features are available for free during beta. Subscription limits will be enforced after payment integration.*

---

## Free Tier Capacity

Running on free tiers (Vercel Hobby, Neon Free, Groq Free, Jina Free):

| Metric | Limit |
|--------|-------|
| Concurrent users | ~10 |
| Dream analyses/day | ~100 |
| Total dreams (storage) | ~10,000 |
| Monthly active users | ~500-1,000 |

---

## Contributing

Contributions are welcome. Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes with clear messages
4. Push to your fork
5. Open a Pull Request with a detailed description

### Code Standards

- Follow TypeScript best practices
- Use Prettier for formatting
- Write meaningful commit messages
- Add appropriate comments for complex logic

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Support

For issues, feature requests, or questions:

- Open an issue on GitHub
- Email: support@dreamjournal.ai

---

**Dream Journal AI** - Transform your subconscious into structured insight.
