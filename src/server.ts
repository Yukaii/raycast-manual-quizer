import { getTopics } from "./markdown-reader";
import { generateQuiz, validateAnswer, type QuizConfig } from "./quiz-generator";
import indexHtml from "./index.html";

// Store active quizzes in memory (in production, use a database)
const quizStore = new Map();

Bun.serve({
  port: 3000,
  routes: {
    // Serve the main UI
    "/": indexHtml,

    // Get all available topics
    "/api/topics": {
      GET: async () => {
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
              options: q.options,
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

console.log(`🚀 Quiz Generator running at http://localhost:3000`);
console.log(`📚 Make sure GOOGLE_GENERATIVE_AI_API_KEY is set in your .env file`);
