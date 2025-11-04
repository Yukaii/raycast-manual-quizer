# 📚 Raycast 小學堂

An AI-powered quiz generator for learning Raycast productivity features. This application crawls the official Raycast manual, converts it to structured markdown, and uses Google Gemini AI to generate personalized bilingual quiz questions.

## Screenshots

### Application Interface

![Raycast Quiz App](screenshots/app-interface.png)

### Development Process with Raycast AI

The HTML fetcher and cleanup utilities were developed using Raycast AI with Sonnet 4.5:

![Raycast AI - HTML Fetcher Development](screenshots/raycast-ai-conversation-1.png)
*Vibe coding the HTML fetcher with Raycast AI*

![Raycast AI - HTML Cleanup Part 1](screenshots/raycast-ai-conversation-2.png)
*Developing HTML cleanup logic*

![Raycast AI - HTML Cleanup Part 2](screenshots/raycast-ai-conversation-3.png)
*Refining the HTML to Markdown conversion process*

## Features

- 🤖 **AI-Powered Question Generation** - Uses Google Gemini AI (Sonnet 4.5) to create contextual questions
- 🌏 **Bilingual Support** - Full English and Traditional Chinese interface
- 📝 **Multiple Question Types** - Multiple choice, true/false, and short answer questions
- 🎯 **Difficulty Levels** - Choose from easy, medium, or hard questions
- 📚 **Topic-Based Learning** - Select specific topics from the Raycast manual
- ⚡ **Instant Feedback** - Get immediate AI-powered explanations for your answers
- 🎨 **Modern UI** - Beautiful dark theme with smooth animations
- 🔄 **Live Validation** - Multiple attempts allowed with intelligent feedback

## How It Works

1. **Crawl** - Fetches content from the official Raycast manual website
2. **Convert** - Transforms HTML to clean markdown using Turndown
3. **Process** - Feeds structured content to Google Gemini AI
4. **Generate** - Creates personalized quiz questions with bilingual support
5. **Validate** - Provides instant AI-powered feedback and explanations

## Tech Stack

- **[Bun](https://bun.sh)** - Fast JavaScript runtime and bundler
- **React 19** - Frontend UI framework
- **Google Gemini AI** - Question generation and answer validation
- **Turndown** - HTML to Markdown conversion
- **TypeScript** - Type-safe development

### Development Tools

- **[Claude Code](https://claude.ai/claude-code)** - AI-powered development assistance
- **[Raycast AI](https://www.raycast.com)** - Enhanced productivity and workflow

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.3.0 or higher
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd manual
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
# Create a .env file (Bun automatically loads it)
echo "GOOGLE_GENERATIVE_AI_API_KEY=your-api-key-here" > .env
```

### Development

Run the development server with hot reload:

```bash
bun run dev
```

The application will be available at `http://localhost:3333`

### Production

Start the production server:

```bash
bun run start
```

## Project Structure

```
manual/
├── src/
│   ├── server.ts           # Bun server with API routes
│   ├── app.tsx             # Main React application
│   ├── index.html          # HTML entry point
│   ├── styles.css          # Main application styles
│   └── bilingual-styles.css # Bilingual typography styles
├── data/                   # Crawled Raycast manual content
├── screenshot.png          # Application screenshot
├── package.json
└── README.md
```

## API Endpoints

- `GET /` - Serves the main application
- `GET /api/topics` - Returns available quiz topics
- `POST /api/quiz/generate` - Generates a new quiz based on configuration
- `POST /api/quiz/:quizId/validate` - Validates a single answer
- `POST /api/quiz/:quizId/submit` - Submits all answers for final scoring

## Configuration

When starting a quiz, you can configure:

- **Topics**: Select from various Raycast manual sections
- **Number of Questions**: 5-30 questions per quiz
- **Difficulty**: Easy, Medium, or Hard
- **Question Types**: Multiple choice, true/false, and/or short answer

## Credits

- Content sourced from the official [Raycast Manual](https://manual.raycast.com/)
- Developed with [Claude Code](https://claude.ai/claude-code) and [Raycast AI](https://www.raycast.com)
- Built with [Bun](https://bun.sh)

## License

This project is for educational purposes. All Raycast content belongs to [Raycast](https://www.raycast.com).

---

**Note**: This is an unofficial educational project and is not affiliated with or endorsed by Raycast.
