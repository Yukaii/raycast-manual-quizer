import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { readTopicContent } from "./markdown-reader";

export type QuestionType = "multiple-choice" | "true-false" | "short-answer";
export type Difficulty = "easy" | "medium" | "hard";

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[]; // For multiple-choice
  correctAnswer: string;
  explanation: string;
  topic: string;
  difficulty: Difficulty;
}

export interface QuizConfig {
  topicIds: string[];
  numberOfQuestions: number;
  difficulty: Difficulty;
  questionTypes: QuestionType[];
}

export interface Quiz {
  id: string;
  questions: QuizQuestion[];
  config: QuizConfig;
  createdAt: Date;
}

/**
 * Generate quiz questions using Google Gemini 2.5 Pro
 */
export async function generateQuiz(config: QuizConfig): Promise<Quiz> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GOOGLE_GENERATIVE_AI_API_KEY environment variable is required. Please add it to your .env file."
    );
  }

  // Read content from selected topics
  const topicContents = await readTopicContent(config.topicIds);

  // Prepare content for AI
  const contentText = topicContents
    .map((tc) => `# ${tc.topic.name}\n\n${tc.content}`)
    .join("\n\n---\n\n");

  // Build the prompt
  const prompt = buildQuizPrompt(contentText, config);

  // Call Gemini API using Vercel AI SDK
  const { text } = await generateText({
    model: google("gemini-2.0-flash-exp"),
    prompt,
    maxTokens: 8192,
  });

  // Parse the response
  const questions = parseQuizResponse(text, config);

  const quiz: Quiz = {
    id: crypto.randomUUID(),
    questions,
    config,
    createdAt: new Date(),
  };

  return quiz;
}

/**
 * Build the prompt for AI to generate quiz questions
 */
function buildQuizPrompt(content: string, config: QuizConfig): string {
  const questionTypesDesc = config.questionTypes
    .map((type) => {
      switch (type) {
        case "multiple-choice":
          return "Multiple choice questions with 4 options (A, B, C, D)";
        case "true-false":
          return "True/False questions";
        case "short-answer":
          return "Short answer questions (1-3 words expected)";
      }
    })
    .join(", ");

  return `You are a quiz generator. Based on the following documentation content, generate ${config.numberOfQuestions} quiz questions.

Requirements:
- Difficulty level: ${config.difficulty}
- Question types: ${questionTypesDesc}
- Distribute question types evenly
- Focus on key concepts, features, and practical usage
- For ${config.difficulty} difficulty:
  ${
    config.difficulty === "easy"
      ? "Focus on basic concepts, definitions, and straightforward facts"
      : config.difficulty === "medium"
        ? "Focus on understanding features, relationships between concepts, and common use cases"
        : "Focus on advanced usage, edge cases, best practices, and detailed technical knowledge"
  }

Documentation Content:
${content.substring(0, 20000)} ${content.length > 20000 ? "\n\n[Content truncated for length...]" : ""}

Return your response as a JSON array of question objects. Each question should have:
{
  "type": "multiple-choice" | "true-false" | "short-answer",
  "question": "The question text",
  "options": ["A", "B", "C", "D"] (only for multiple-choice),
  "correctAnswer": "The correct answer",
  "explanation": "A brief explanation of why this is correct",
  "topic": "Which topic this question is from"
}

For multiple-choice questions:
- Provide 4 options as an array
- correctAnswer should be one of the options exactly

For true-false questions:
- correctAnswer should be "True" or "False"

For short-answer questions:
- correctAnswer should be a concise answer (1-3 words)
- Accept variations in explanation

Return ONLY the JSON array, no additional text.`;
}

/**
 * Parse Claude's response into quiz questions
 */
function parseQuizResponse(
  response: string,
  config: QuizConfig
): QuizQuestion[] {
  try {
    // Extract JSON from response (in case there's extra text)
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("No JSON array found in response");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return parsed.map((q: any, index: number) => ({
      id: `q${index + 1}`,
      type: q.type,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      topic: q.topic,
      difficulty: config.difficulty,
    }));
  } catch (error) {
    console.error("Failed to parse quiz response:", error);
    throw new Error("Failed to parse quiz questions from AI response");
  }
}

/**
 * Validate a user's answer
 */
export function validateAnswer(
  question: QuizQuestion,
  userAnswer: string
): {
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
} {
  let isCorrect = false;

  switch (question.type) {
    case "multiple-choice":
    case "true-false":
      isCorrect =
        userAnswer.toLowerCase().trim() ===
        question.correctAnswer.toLowerCase().trim();
      break;
    case "short-answer":
      // For short answers, be more lenient with matching
      const userNormalized = userAnswer.toLowerCase().trim();
      const correctNormalized = question.correctAnswer.toLowerCase().trim();
      isCorrect =
        userNormalized === correctNormalized ||
        userNormalized.includes(correctNormalized) ||
        correctNormalized.includes(userNormalized);
      break;
  }

  return {
    isCorrect,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
  };
}
