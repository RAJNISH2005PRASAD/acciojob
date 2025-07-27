# Component Playground

A modern, full-stack React application for generating, previewing, and exporting React components with chat-driven code generation.

## Features
- User authentication (signup/login)
- Chat-driven component generation (AI or mock)
- Live preview of generated components
- Syntax-highlighted JSX and CSS code tabs
- Export code as ZIP or copy to clipboard
- Session management (create, select, save sessions)
- Beautiful, responsive UI with a light green, grey, and indigo palette

## Tech Stack
- **Frontend:** React, Vite, MUI (Material UI), PrismJS
- **Backend:** Node.js, Express, MongoDB, Redis
- **AI Integration:** OpenRouter API (or mock for local testing)

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB (local or Atlas)
- Redis (local or cloud)

### Setup

#### 1. Clone the repository
```bash
git clone <your-repo-url>
cd <your-repo-folder>
```

#### 2. Install dependencies
```bash
cd backend
npm install
cd ../frontend
npm install
```

#### 3. Configure environment variables
- Copy `.env.example` to `.env` in the backend and fill in your MongoDB, Redis, and API keys.

#### 4. Start the backend
```bash
cd backend
npx nodemon server.js
```

#### 5. Start the frontend
```bash
cd frontend
npm run dev
```

#### 6. Open the app
Go to [http://localhost:5173](http://localhost:5173) in your browser.

## Usage
- Sign up or log in.
- Create a new session.
- Use the chat to generate or edit a React component.
- Preview the component live, view the code, and export as needed.

## Customization
- To use a real AI, set your OpenRouter API key in the backend `.env`.
- To use a mock AI, the backend will return a sample component for testing.

## License
MIT 