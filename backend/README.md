# StudyAI Frontend

A modern, responsive React + Vite + Tailwind CSS frontend for the StudyAI study assistant application.

## Features

- **Chat Interface**: ChatGPT-like conversational interface with message history
- **File Upload**: Upload images, PDFs, and documents with your messages
- **Suggestion Boxes**: Quick-start suggestions for common questions
- **Study Evaluator**: Evaluate study plans with AI-powered feedback
- **Sidebar Navigation**: Toggle menu to switch between different features
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Theme**: Modern, eye-friendly dark interface

## Tech Stack

- **React 18**: UI library
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API calls

## Setup

### Prerequisites

- Node.js 16+ and npm/yarn

### Installation

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## Project Structure

```
src/
├── components/
│   ├── ChatInterface.jsx      # Main chat component
│   ├── ChatInput.jsx          # Message input with file upload
│   ├── ChatMessage.jsx        # Individual message display
│   ├── Header.jsx             # App header with menu button
│   ├── SuggestionBox.jsx      # Suggestion box component
│   ├── Sidebar.jsx            # Navigation sidebar
│   └── StudyEvaluator.jsx     # Study plan evaluation form
├── api.js                     # Backend API calls
├── App.jsx                    # Main app component
├── main.jsx                   # Entry point
└── index.css                  # Global styles
```

## API Integration

The frontend communicates with the Go backend at `http://localhost:8080`:

- **POST /chat**: Send a message to the AI chat
- **POST /agent/run**: Evaluate a study plan

Make sure the backend server is running before starting the frontend.

## Configuration

To customize colors and styling, edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#10a37f',      // Change primary color
      dark: '#0d0d0d',         // Change dark background
      darkCard: '#1a1a1a',     // Change card background
    },
  },
}
```

## Development

### Hot Module Replacement

Vite supports HMR out of the box. Changes to components will hot-reload automatically.

### Debugging

Open DevTools in your browser and use React DevTools extension for easier debugging.

## License

MIT
