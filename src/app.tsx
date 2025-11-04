import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import "./bilingual-styles.css";

type QuestionType = "multiple-choice" | "true-false" | "short-answer";
type Difficulty = "easy" | "medium" | "hard";

interface Topic {
  id: string;
  name: string;
  filename: string;
}

interface Question {
  id: string;
  type: QuestionType;
  question: string;
  questionZh: string;
  options?: string[];
  optionsZh?: string[];
  topic: string;
  difficulty: Difficulty;
}

interface Quiz {
  id: string;
  questions: Question[];
  config: any;
}

interface QuestionFeedback {
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  results: Array<{
    questionId: string;
    question: string;
    userAnswer: string;
    isCorrect: boolean;
    correctAnswer: string;
    explanation: string;
  }>;
}

type AppState = "setup" | "loading" | "quiz" | "results";

function App() {
  const [state, setState] = useState<AppState>("setup");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [numberOfQuestions, setNumberOfQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>([
    "multiple-choice",
    "true-false",
  ]);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState<string>("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<QuestionFeedback | null>(null);
  const [questionResults, setQuestionResults] = useState<Record<string, QuestionFeedback>>({});
  const [attemptCounts, setAttemptCounts] = useState<Record<string, number>>({});
  const [results, setResults] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string>("");

  // Load topics on mount
  useEffect(() => {
    fetch("/api/topics")
      .then((res) => res.json())
      .then((data) => setTopics(data.topics))
      .catch((err) => setError("Failed to load topics"));
  }, []);

  const toggleTopic = (topicId: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    );
  };

  const toggleQuestionType = (type: QuestionType) => {
    setQuestionTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const startQuiz = async () => {
    if (selectedTopics.length === 0) {
      setError("Please select at least one topic");
      return;
    }
    if (questionTypes.length === 0) {
      setError("Please select at least one question type");
      return;
    }

    setState("loading");
    setError("");

    try {
      const response = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicIds: selectedTopics,
          numberOfQuestions,
          difficulty,
          questionTypes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate quiz");
      }

      const quizData = await response.json();
      setQuiz(quizData);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setCurrentAnswer("");
      setShowFeedback(false);
      setQuestionResults({});
      setAttemptCounts({});
      setState("quiz");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate quiz");
      setState("setup");
    }
  };

  const submitAnswer = async () => {
    if (!quiz || !currentAnswer.trim()) return;

    const question = quiz.questions[currentQuestionIndex];

    try {
      const response = await fetch(`/api/quiz/${quiz.id}/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: question.id,
          answer: currentAnswer,
        }),
      });

      const feedback = await response.json();

      // Increment attempt count
      const currentAttempts = attemptCounts[question.id] || 0;
      setAttemptCounts({ ...attemptCounts, [question.id]: currentAttempts + 1 });

      setCurrentFeedback(feedback);
      setShowFeedback(true);

      // Only save the answer and result if correct
      if (feedback.isCorrect) {
        setAnswers({ ...answers, [question.id]: currentAnswer });
        setQuestionResults({ ...questionResults, [question.id]: feedback });
      }
    } catch (err) {
      setError("Failed to validate answer");
    }
  };

  const tryAgain = () => {
    setCurrentAnswer("");
    setShowFeedback(false);
    setCurrentFeedback(null);
  };

  const skipQuestion = () => {
    if (!quiz) return;

    const question = quiz.questions[currentQuestionIndex];

    // Mark as skipped by saving an empty result
    if (!questionResults[question.id]) {
      setQuestionResults({
        ...questionResults,
        [question.id]: {
          isCorrect: false,
          correctAnswer: "",
          explanation: "Question was skipped"
        }
      });
    }

    // Move to next question
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentAnswer("");
      setShowFeedback(false);
      setCurrentFeedback(null);
    } else {
      // Quiz complete, calculate final results
      finishQuiz();
    }
  };

  const nextQuestion = () => {
    if (!quiz) return;

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentAnswer("");
      setShowFeedback(false);
      setCurrentFeedback(null);
    } else {
      // Quiz complete, calculate final results
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    if (!quiz) return;

    const score = Object.values(questionResults).filter((r) => r.isCorrect).length;
    const totalQuestions = quiz.questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    const resultsData: QuizResult = {
      score,
      totalQuestions,
      percentage,
      results: quiz.questions.map((q) => ({
        questionId: q.id,
        question: q.question,
        userAnswer: answers[q.id] || "",
        isCorrect: questionResults[q.id]?.isCorrect || false,
        correctAnswer: questionResults[q.id]?.correctAnswer || "",
        explanation: questionResults[q.id]?.explanation || "",
      })),
    };

    setResults(resultsData);
    setState("results");
  };

  const resetQuiz = () => {
    setState("setup");
    setQuiz(null);
    setAnswers({});
    setCurrentAnswer("");
    setShowFeedback(false);
    setQuestionResults({});
    setAttemptCounts({});
    setResults(null);
    setCurrentQuestionIndex(0);
    setError("");
  };

  if (state === "loading") {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Generating your personalized quiz with AI...</p>
        </div>
      </div>
    );
  }

  if (state === "setup") {
    return (
      <div className="container">
        <header>
          <h1>📚 Raycast 小學堂</h1>
          <p>Test your knowledge with AI-generated questions</p>
        </header>

        {error && <div className="error">{error}</div>}

        <div className="setup-section">
          <h2>1. Select Topics ({selectedTopics.length} selected)</h2>
          <div className="topic-grid">
            {topics.map((topic) => (
              <button
                key={topic.id}
                className={`topic-button ${selectedTopics.includes(topic.id) ? "selected" : ""}`}
                onClick={() => toggleTopic(topic.id)}
              >
                {topic.name}
              </button>
            ))}
          </div>
          <div className="quick-actions">
            <button onClick={() => setSelectedTopics(topics.map((t) => t.id))}>
              Select All
            </button>
            <button onClick={() => setSelectedTopics([])}>Clear All</button>
          </div>
        </div>

        <div className="setup-section">
          <h2>2. Configure Quiz</h2>

          <div className="config-group">
            <label>
              Number of Questions:
              <input
                type="number"
                min="5"
                max="30"
                value={numberOfQuestions}
                onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
              />
            </label>
          </div>

          <div className="config-group">
            <label>Difficulty:</label>
            <div className="button-group">
              {(["easy", "medium", "hard"] as Difficulty[]).map((level) => (
                <button
                  key={level}
                  className={difficulty === level ? "active" : ""}
                  onClick={() => setDifficulty(level)}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="config-group">
            <label>Question Types:</label>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={questionTypes.includes("multiple-choice")}
                  onChange={() => toggleQuestionType("multiple-choice")}
                />
                Multiple Choice
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={questionTypes.includes("true-false")}
                  onChange={() => toggleQuestionType("true-false")}
                />
                True/False
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={questionTypes.includes("short-answer")}
                  onChange={() => toggleQuestionType("short-answer")}
                />
                Short Answer
              </label>
            </div>
          </div>
        </div>

        <button className="start-button" onClick={startQuiz}>
          Generate Quiz with AI
        </button>
      </div>
    );
  }

  if (state === "quiz" && quiz) {
    const question = quiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
    const score = Object.values(questionResults).filter((r) => r.isCorrect).length;

    return (
      <div className="container">
        <div className="quiz-header">
          <h2>Quiz in Progress</h2>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <p>
            Question {currentQuestionIndex + 1} of {quiz.questions.length} • Score: {score}/{currentQuestionIndex}
          </p>
        </div>

        <div className="question-card">
          <div className="question-meta">
            <span className="badge">{question.topic}</span>
            <span className="badge">{question.difficulty}</span>
            <span className="badge">{question.type}</span>
          </div>

          <div className="bilingual-question">
            <h3 className="question-zh">{question.questionZh}</h3>
            <h3 className="question-en">{question.question}</h3>
          </div>

          {!showFeedback && question.type === "multiple-choice" && question.options && question.optionsZh && (
            <div className="options">
              {question.options.map((option, idx) => (
                <button
                  key={idx}
                  className={`option-button ${currentAnswer === option ? "selected" : ""}`}
                  onClick={() => setCurrentAnswer(option)}
                >
                  <div className="option-zh">{question.optionsZh[idx]}</div>
                  <div className="option-en">{option}</div>
                </button>
              ))}
            </div>
          )}

          {!showFeedback && question.type === "true-false" && (
            <div className="options">
              {[
                { en: "True", zh: "正確" },
                { en: "False", zh: "錯誤" }
              ].map((option) => (
                <button
                  key={option.en}
                  className={`option-button ${currentAnswer === option.en ? "selected" : ""}`}
                  onClick={() => setCurrentAnswer(option.en)}
                >
                  <div className="option-zh">{option.zh}</div>
                  <div className="option-en">{option.en}</div>
                </button>
              ))}
            </div>
          )}

          {!showFeedback && question.type === "short-answer" && (
            <input
              type="text"
              className="answer-input"
              placeholder="輸入你的答案 / Type your answer..."
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
            />
          )}

          {showFeedback && currentFeedback && (
            <div className={`feedback-card ${currentFeedback.isCorrect ? "correct" : "incorrect"}`}>
              <div className="feedback-header">
                <span className={`feedback-badge ${currentFeedback.isCorrect ? "correct" : "incorrect"}`}>
                  {currentFeedback.isCorrect ? "✓ 正確！Correct!" : "✗ 錯誤 Incorrect"}
                </span>
                {attemptCounts[question.id] > 0 && (
                  <span className="attempt-counter">
                    嘗試 {attemptCounts[question.id]} 次 • Attempt {attemptCounts[question.id]}
                  </span>
                )}
              </div>
              <div className="feedback-content">
                {currentFeedback.isCorrect ? (
                  <>
                    <p><strong>你的答案 Your answer:</strong> {currentAnswer}</p>
                    <p className="explanation">
                      <strong>說明 Explanation:</strong> {currentFeedback.explanation}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="try-again-message">
                      <strong>❌ 不正確！讓其他人試試看</strong><br />
                      <strong>Not correct! Let someone else try</strong>
                    </p>
                    <p className="incorrect-answer"><strong>答案：</strong> {currentAnswer}</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="quiz-navigation">
          {!showFeedback ? (
            <>
              <button
                className="submit-button"
                onClick={submitAnswer}
                disabled={!currentAnswer.trim()}
              >
                提交答案 Submit Answer
              </button>
              <button className="skip-button" onClick={skipQuestion}>
                跳過 Skip →
              </button>
            </>
          ) : currentFeedback?.isCorrect ? (
            <button className="submit-button" onClick={nextQuestion}>
              {currentQuestionIndex < quiz.questions.length - 1 ? "下一題 Next Question →" : "查看結果 View Results"}
            </button>
          ) : (
            <>
              <button className="try-again-button" onClick={tryAgain}>
                讓其他人試試 Let Someone Else Try
              </button>
              <button className="skip-button" onClick={skipQuestion}>
                跳過 Skip →
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  if (state === "results" && results) {
    return (
      <div className="container">
        <div className="results-header">
          <h1>Quiz Results</h1>
          <div className="score-card">
            <div className="score-circle">
              <span className="score-number">{results.percentage}%</span>
            </div>
            <p>
              You got {results.score} out of {results.totalQuestions} questions
              correct!
            </p>
          </div>
        </div>

        <div className="results-list">
          {results.results.map((result, idx) => (
            <div
              key={result.questionId}
              className={`result-card ${result.isCorrect ? "correct" : "incorrect"}`}
            >
              <div className="result-header">
                <span className="result-number">#{idx + 1}</span>
                <span className={`result-badge ${result.isCorrect ? "correct" : "incorrect"}`}>
                  {result.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                </span>
              </div>
              <h3>{result.question}</h3>
              <div className="result-answers">
                <p>
                  <strong>Your answer:</strong> {result.userAnswer || "(No answer)"}
                </p>
                {!result.isCorrect && (
                  <p>
                    <strong>Correct answer:</strong> {result.correctAnswer}
                  </p>
                )}
                <p className="explanation">
                  <strong>Explanation:</strong> {result.explanation}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button className="start-button" onClick={resetQuiz}>
          Take Another Quiz
        </button>
      </div>
    );
  }

  return null;
}

// Mount the app
const rootElement = document.getElementById("root");
if (rootElement && !rootElement.hasChildNodes()) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
