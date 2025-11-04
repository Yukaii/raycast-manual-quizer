import { getTopics } from "./markdown-reader";
import { generateQuiz, validateAnswer, type QuizConfig } from "./quiz-generator";
import indexHtml from "./index.html";
import { parseArgs } from "util";

// HTTP Basic Auth middleware
function requireAuth(req: Request): Response | null {
  const authHeader = req.headers.get("Authorization");

  // Check if AUTH_USERNAME and AUTH_PASSWORD are set
  const requiredUsername = process.env.AUTH_USERNAME;
  const requiredPassword = process.env.AUTH_PASSWORD;

  // Skip auth if credentials are not configured
  if (!requiredUsername || !requiredPassword) {
    console.warn("⚠️  Warning: AUTH_USERNAME and AUTH_PASSWORD not set. API endpoints are unprotected!");
    return null;
  }

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return new Response("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Quiz API"',
      },
    });
  }

  try {
    // Decode the base64 credentials
    const base64Credentials = authHeader.slice(6);
    const credentials = atob(base64Credentials);
    const [username, password] = credentials.split(":");

    // Verify credentials
    if (username !== requiredUsername || password !== requiredPassword) {
      return new Response("Unauthorized", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Quiz API"',
        },
      });
    }

    // Authentication successful
    return null;
  } catch (error) {
    return new Response("Bad Request", {
      status: 400,
    });
  }
}

// Parse command-line arguments
const { values } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    port: {
      type: "string",
      short: "p",
      default: "3000",
    },
    help: {
      type: "boolean",
      short: "h",
      default: false,
    },
  },
  allowPositionals: true,
});

if (values.help) {
  console.log(`
Raycast 小學堂 - Quiz Generator Server

Usage: bun src/server.ts [options]

Options:
  -p, --port <number>    Port to listen on (default: 3000)
  -h, --help            Show this help message

Examples:
  bun src/server.ts
  bun src/server.ts --port 8080
  bun src/server.ts -p 4000
  `);
  process.exit(0);
}

const port = parseInt(values.port as string, 10);

if (isNaN(port) || port < 1 || port > 65535) {
  console.error("❌ Invalid port number. Port must be between 1 and 65535.");
  process.exit(1);
}

// Store active quizzes in memory (in production, use a database)
const quizStore = new Map();

Bun.serve({
  port,
  routes: {
    // Serve the main UI
    "/": indexHtml,

    // Get all available topics
    "/api/topics": {
      GET: async (req) => {
        // Check authentication
        const authResponse = requireAuth(req);
        if (authResponse) return authResponse;

        try {
          const topics = await getTopics();
          return Response.json({ topics });
        } catch (error) {
          console.error("Error getting topics:", error);
          return Response.json(
            { error: "Failed to fetch topics" },
            { status: 500 }
          );
        }
      },
    },

    // Generate a new quiz
    "/api/quiz/generate": {
      POST: async (req) => {
        // Check authentication
        const authResponse = requireAuth(req);
        if (authResponse) return authResponse;

        try {
          const body = await req.json();
          const config: QuizConfig = {
            topicIds: body.topicIds || [],
            numberOfQuestions: body.numberOfQuestions || 10,
            difficulty: body.difficulty || "medium",
            questionTypes: body.questionTypes || [
              "multiple-choice",
              "true-false",
            ],
          };

          if (config.topicIds.length === 0) {
            return Response.json(
              { error: "Please select at least one topic" },
              { status: 400 }
            );
          }

          const quiz = await generateQuiz(config);

          // Store quiz for validation later
          quizStore.set(quiz.id, quiz);

          // Return quiz without correct answers
          const quizForClient = {
            id: quiz.id,
            questions: quiz.questions.map((q) => ({
              id: q.id,
              type: q.type,
              question: q.question,
              questionZh: q.questionZh,
              options: q.options,
              optionsZh: q.optionsZh,
              topic: q.topic,
              difficulty: q.difficulty,
            })),
            config: quiz.config,
          };

          return Response.json(quizForClient);
        } catch (error) {
          console.error("Error generating quiz:", error);
          return Response.json(
            {
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to generate quiz",
            },
            { status: 500 }
          );
        }
      },
    },

    // Validate a single answer
    "/api/quiz/:quizId/validate": {
      POST: async (req) => {
        // Check authentication
        const authResponse = requireAuth(req);
        if (authResponse) return authResponse;

        try {
          const quizId = req.params.quizId;
          const quiz = quizStore.get(quizId);

          if (!quiz) {
            return Response.json({ error: "Quiz not found" }, { status: 404 });
          }

          const body = await req.json();
          const { questionId, answer } = body;

          const question = quiz.questions.find((q: any) => q.id === questionId);
          if (!question) {
            return Response.json({ error: "Question not found" }, { status: 404 });
          }

          const validation = validateAnswer(question, answer);
          return Response.json(validation);
        } catch (error) {
          console.error("Error validating answer:", error);
          return Response.json(
            { error: "Failed to validate answer" },
            { status: 500 }
          );
        }
      },
    },

    // Submit quiz answers and get results
    "/api/quiz/:quizId/submit": {
      POST: async (req) => {
        // Check authentication
        const authResponse = requireAuth(req);
        if (authResponse) return authResponse;

        try {
          const quizId = req.params.quizId;
          const quiz = quizStore.get(quizId);

          if (!quiz) {
            return Response.json({ error: "Quiz not found" }, { status: 404 });
          }

          const body = await req.json();
          const userAnswers = body.answers; // { questionId: answer }

          // Validate each answer
          const results = quiz.questions.map((question: any) => {
            const userAnswer = userAnswers[question.id] || "";
            const validation = validateAnswer(question, userAnswer);

            return {
              questionId: question.id,
              question: question.question,
              userAnswer,
              ...validation,
            };
          });

          const score = results.filter((r) => r.isCorrect).length;
          const totalQuestions = quiz.questions.length;
          const percentage = Math.round((score / totalQuestions) * 100);

          return Response.json({
            score,
            totalQuestions,
            percentage,
            results,
          });
        } catch (error) {
          console.error("Error submitting quiz:", error);
          return Response.json(
            { error: "Failed to submit quiz" },
            { status: 500 }
          );
        }
      },
    },
  },

  development: {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Quiz Generator running at http://localhost:${port}`);
console.log(`📚 Make sure GOOGLE_GENERATIVE_AI_API_KEY is set in your .env file`);
