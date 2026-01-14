# Dream Journal AI

A voice-first AI-powered dream journal application that helps users record, transcribe, analyze, and understand their dreams. Built with Next.js 15, featuring real-time voice transcription, psychological pattern analysis, and privacy-focused encrypted storage.

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
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Dream Journal AI transforms the ephemeral nature of dreams into a structured, searchable database of your subconscious. Using advanced speech-to-text technology and AI-powered analysis, users can capture dreams immediately upon waking through voice recording, receive psychological interpretations, and discover patterns across their dream history.

The application prioritizes privacy with encrypted storage and follows a minimalist "Editorial Dark Mode" design philosophy for a premium user experience.

---

## Features

### Core Functionality
- **Voice-First Recording**: Capture dreams through voice input with real-time transcription using OpenAI Whisper
- **AI Dream Analysis**: Automatic extraction of themes, emotions, symbols, people, and settings using LLM analysis
- **Pattern Recognition**: Identify recurring themes and symbols across your dream history
- **Similar Dream Discovery**: Vector-based semantic search to find dreams with similar content
- **Dream Interpretation**: Jungian and Freudian psychological interpretations

### User Experience
- **Editorial Dark Mode**: Premium matte black interface with refined typography
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Weekly Insights**: Visualized analytics including dream frequency, emotional patterns, and clarity trends
- **Export Options**: Download dreams as PDF or Markdown files
- **Pre-Sleep Tracking**: Log mood, stress level, and sleep quality before sleep

### Privacy and Security
- **Encrypted Storage**: All dream entries encrypted at rest
- **OAuth Authentication**: Secure sign-in via Google or GitHub
- **Data Ownership**: Full export and deletion capabilities

---

## Technology Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI / Shadcn UI
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Vector Store**: pgvector extension for semantic search
- **Authentication**: NextAuth.js v5

### AI/ML Services
- **Speech-to-Text**: OpenAI Whisper / Groq Whisper
- **Text Analysis**: Groq LLaMA / OpenAI GPT
- **Embeddings**: OpenAI text-embedding-3-small

### Infrastructure
- **Deployment**: Vercel
- **Database Hosting**: Neon / Supabase PostgreSQL
- **File Storage**: Vercel Blob (optional)

---

## Prerequisites

- Node.js 18.x or higher
- npm or yarn
- PostgreSQL database with pgvector extension
- API keys for AI services (Groq and/or OpenAI)

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
   cp .env.example .env.local
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# Authentication
AUTH_SECRET="your-auth-secret-key"
AUTH_GOOGLE_ID="your-google-oauth-client-id"
AUTH_GOOGLE_SECRET="your-google-oauth-client-secret"
AUTH_GITHUB_ID="your-github-oauth-client-id"
AUTH_GITHUB_SECRET="your-github-oauth-client-secret"

# AI Services
GROQ_API_KEY="your-groq-api-key"
OPENAI_API_KEY="your-openai-api-key"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Variable Descriptions

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string with pgvector support |
| `AUTH_SECRET` | Yes | Random secret for NextAuth.js session encryption |
| `AUTH_GOOGLE_ID` | No | Google OAuth 2.0 Client ID |
| `AUTH_GOOGLE_SECRET` | No | Google OAuth 2.0 Client Secret |
| `AUTH_GITHUB_ID` | No | GitHub OAuth App Client ID |
| `AUTH_GITHUB_SECRET` | No | GitHub OAuth App Client Secret |
| `GROQ_API_KEY` | Yes | Groq API key for Whisper transcription and LLaMA analysis |
| `OPENAI_API_KEY` | No | OpenAI API key for embeddings (fallback) |

---

## Usage

### Recording a Dream

1. Navigate to the Dashboard
2. Click "New Entry" or the floating microphone button
3. Speak your dream narrative naturally
4. The system will transcribe and analyze automatically
5. Review the generated analysis, themes, and interpretation

### Viewing Insights

1. Navigate to the Insights page
2. View weekly reports, pattern charts, and emotional trends
3. Generate comprehensive weekly summaries with AI

### Exporting Data

1. Open Settings
2. Use "Export All Dreams" for complete backup
3. Individual dreams can be exported from their detail pages

---

## Project Structure

```
dream-journal/
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── api/               # API route handlers
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── dreams/        # Dream CRUD operations
│   │   │   ├── insights/      # Analytics endpoints
│   │   │   ├── transcribe/    # Voice transcription
│   │   │   └── export/        # Export functionality
│   │   ├── dashboard/         # Main journal view
│   │   ├── dreams/[id]/       # Individual dream detail
│   │   ├── insights/          # Analytics dashboard
│   │   ├── settings/          # User settings
│   │   ├── privacy/           # Privacy policy
│   │   ├── terms/             # Terms of service
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── landing/           # Landing page sections
│   │   ├── ui/                # Shadcn UI components
│   │   ├── navigation.tsx     # App navigation
│   │   ├── dream-card.tsx     # Dream list item
│   │   ├── dream-form.tsx     # Recording interface
│   │   └── ...                # Other components
│   ├── lib/
│   │   ├── prisma.ts          # Database client
│   │   ├── auth.ts            # Authentication config
│   │   └── utils.ts           # Utility functions
│   └── styles/
│       └── globals.css        # Global styles
├── .env.local                 # Environment variables
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
| GET | `/api/dreams` | List all dreams for authenticated user |
| POST | `/api/dreams` | Create a new dream entry |
| GET | `/api/dreams/[id]` | Get a specific dream |
| DELETE | `/api/dreams/[id]` | Delete a dream |
| GET | `/api/dreams/[id]/similar` | Find semantically similar dreams |

### Transcription

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/transcribe` | Transcribe audio to text using Whisper |

### Insights

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/insights/patterns` | Get theme and symbol patterns |
| GET | `/api/insights/stats` | Get dream statistics |
| GET | `/api/insights/weekly` | Get weekly report data |
| POST | `/api/insights/weekly` | Generate AI weekly summary |

### Export

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/export/pdf` | Export dreams as PDF |
| POST | `/api/export/md` | Export dreams as Markdown |

---

## Database Schema

### Core Models

**User**
- Linked to authentication provider
- Stores preferences and usage limits

**Dream**
- Transcript text content
- Recording timestamp
- Pre-sleep metrics (mood, stress, sleep quality)
- Vector embedding for semantic search

**DreamAnalysis**
- Extracted themes, emotions, symbols
- People and settings identified
- Nightmare and lucid dream flags
- Vividness score
- AI-generated summary

---

## Authentication

The application uses NextAuth.js v5 with the following providers:

- **Google OAuth 2.0**: Primary authentication method
- **GitHub OAuth**: Alternative for developers

Session data is stored in JWT tokens with database-backed user records.

### Setting Up OAuth

1. **Google**: Create credentials at [Google Cloud Console](https://console.cloud.google.com/)
2. **GitHub**: Create an OAuth App at [GitHub Developer Settings](https://github.com/settings/developers)

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
- Contact: support@dreamjournal.ai

---

**Dream Journal AI** - Transform your subconscious into structured insight.
