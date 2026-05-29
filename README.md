# Farmer OS (कृषि साथी)

An AI-powered, voice-first farming companion web application designed for Indian farmers. Developed with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Dashboard**: High-level farm reporting featuring weather alerts, active crop tasks, and trending price summaries.
- **Voice Assistant UI**: Speech recognition companion allowing hands-free task logging and price querying.
- **Conversational Chatbot**: Multilingual AI assistant supporting Hindi, Punjabi, and English queries.
- **Crop Prices**: Daily mandi rates with interactive category filters and search options.
- **Reminders**: Scheduling tool for irrigation, spraying, fertilizer feeding, and harvesting alerts.
- **Timeline**: A chronological log of actions performed on crops (e.g. soil tests, fertilizer logs).
- **Govt Schemes**: Database of agricultural subsidies, credit systems, and insurance policies.

## 🛠️ Stack

- **Framework**: Next.js 15 App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Voice Recognition**: Web Speech API (HTML5 SpeechRecognition)
- **Voice Feedback**: Web SpeechSynthesis (Text-to-Speech)

## 📁 Project Structure

```text
src/
├── app/                  # Route handlers & Pages (Dashboard, Chatbot, Voice, Timeline, Prices, Schemes, Reminders)
├── components/           # Sidebar navigation, VoiceLogger visualizer, Chatbot interface
├── context/              # AppContext managing stateful mock DB, voice feeds, and TTS
├── data/                 # Static mock data (mandi rates, government policies, central alerts)
├── database/             # localStorage state sync client (mock database)
├── hooks/                # Custom hooks (Web Speech API wrapper)
├── lib/                  # Standard helper utilities (formatting INR, dates)
├── services/             # Mock AI intent parser and bilingual reply mapper
├── styles/               # Custom CSS styles (glassmorphism, audio wave keyframes)
└── types/                # TypeScript interface contracts
```

## 💻 Quick Start

First, install the package dependencies:

```bash
npm install
```

Second, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3500) (or the port specified by the dev server output) with your browser to experience the application.
