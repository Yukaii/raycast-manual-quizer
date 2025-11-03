# 📚 AI-Powered Quiz Generator

An intelligent quiz generator that creates personalized quizzes from the Raycast documentation using Google Gemini 2.5 Pro.

## Features

- **AI-Generated Questions**: Uses Google's Gemini 2.5 Pro to generate contextual questions from markdown documentation
- **Multiple Question Types**:
  - Multiple Choice (4 options)
  - True/False
  - Short Answer
- **Difficulty Levels**: Easy, Medium, and Hard
- **Topic Selection**: Choose specific topics or quiz from all documentation
- **Interactive UI**: Clean, modern interface built with React
- **Instant Feedback**: Get detailed explanations for each answer
- **Progress Tracking**: Visual progress bar and score tracking

## Architecture

### Backend (Bun.serve)
- `/api/topics` - List all available markdown topics
- `/api/quiz/generate` - Generate AI-powered quiz
- `/api/quiz/:id/submit` - Submit answers and get results

### AI Integration
- Uses Google Gemini 2.5 Pro via Vercel AI SDK for intelligent question generation
- Analyzes markdown content to create relevant questions
- Provides explanations for each answer

### Frontend (React)
- Topic selection interface
- Quiz configuration (questions, difficulty, types)
- Interactive quiz-taking experience
- Detailed results with explanations

## Setup

### 1. Install Dependencies

```bash
bun install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Google Gemini API key:

```
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

Get your API key from: https://aistudio.google.com/app/apikey

### 3. Run the Quiz Generator

```bash
bun run quiz
```

Or using the dev script with hot reload:

```bash
bun run dev
```

The application will start at: http://localhost:3000

## Usage

### Step 1: Select Topics
- Browse all 42 available Raycast documentation topics
- Select one or more topics to include in your quiz
- Use "Select All" or "Clear All" for quick selection

### Step 2: Configure Quiz
- **Number of Questions**: Choose 5-30 questions
- **Difficulty**: Easy, Medium, or Hard
- **Question Types**: Select which types to include

### Step 3: Take the Quiz
- Answer questions at your own pace
- Navigate between questions
- Submit when ready

### Step 4: Review Results
- See your score and percentage
- Review each question with:
  - Your answer
  - Correct answer
  - Detailed explanation

## Tech Stack

- **Runtime**: Bun
- **Backend**: Bun.serve with routes
- **Frontend**: React 19
- **AI**: Google Gemini 2.5 Pro (via Vercel AI SDK)
- **Styling**: Custom CSS

## Project Structure

```
src/
├── server.ts              # Main server with API routes
├── quiz-generator.ts      # AI quiz generation logic
├── markdown-reader.ts     # Markdown file utilities
├── app.tsx               # React frontend application
├── index.html            # HTML entry point
└── styles.css            # Styling
```

## API Reference

### GET /api/topics
Returns list of available topics.

**Response:**
```json
{
  "topics": [
    {
      "id": "ai",
      "name": "Ai",
      "filename": "ai.md",
      "path": "/path/to/ai.md"
    }
  ]
}
```

### POST /api/quiz/generate
Generate a new quiz.

**Request:**
```json
{
  "topicIds": ["ai", "extensions"],
  "numberOfQuestions": 10,
  "difficulty": "medium",
  "questionTypes": ["multiple-choice", "true-false"]
}
```

**Response:**
```json
{
  "id": "quiz-uuid",
  "questions": [...],
  "config": {...}
}
```

### POST /api/quiz/:quizId/submit
Submit quiz answers and get results.

**Request:**
```json
{
  "answers": {
    "q1": "Option A",
    "q2": "True",
    "q3": "keyboard shortcut"
  }
}
```

**Response:**
```json
{
  "score": 8,
  "totalQuestions": 10,
  "percentage": 80,
  "results": [...]
}
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_GENERATIVE_AI_API_KEY` | Your Google Gemini API key | Yes |

## Tips

- Start with easier difficulty levels to learn the basics
- Mix question types for a comprehensive test
- Review explanations even for correct answers to deepen understanding
- Select related topics for focused learning

## Limitations

- Requires active internet connection for AI generation
- API costs apply based on Google AI pricing (Gemini has a generous free tier)
- Quiz generation may take 5-15 seconds depending on content
- Questions are generated on-the-fly (not cached)

## Future Enhancements

- [ ] Quiz history and progress tracking
- [ ] Timed quiz mode
- [ ] Multiplayer quiz mode
- [ ] Export results to PDF
- [ ] Quiz templates and presets
- [ ] Spaced repetition learning
- [ ] Mobile app version

## License

Private project for learning purposes.
