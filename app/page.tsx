'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Question {
  id: number
  question: string
  options: string[]
  correct: number
}

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [playerName, setPlayerName] = useState('')
  const [nameSubmitted, setNameSubmitted] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(60)
  const [quizStarted, setQuizStarted] = useState(false)

  useEffect(() => {
    fetchQuestions()
  }, [])

  // Timer effect - start countdown when quiz starts, runs for entire quiz
  useEffect(() => {
    if (isFinished || questions.length === 0 || !quizStarted) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isFinished, questions.length, quizStarted])

  // Finish quiz when timer reaches 0
  useEffect(() => {
    if (timeRemaining === 0 && !isFinished && questions.length > 0) {
      // If currently showing a result, just finish
      if (showResult) {
        setIsFinished(true)
        return
      }
      
      // If time runs out while answering, check current answer and finish
      if (selectedAnswer !== null) {
        const isCorrect = selectedAnswer === questions[currentQuestion].correct
        if (isCorrect) {
          setScore((prev) => prev + 1)
        }
      }
      setIsFinished(true)
    }
  }, [timeRemaining, isFinished, selectedAnswer, questions, currentQuestion, showResult])

  const fetchQuestions = async () => {
    try {
      const res = await fetch('/api/questions')
      const data = await res.json()
      setQuestions(data)
    } catch (error) {
      console.error('Error fetching questions:', error)
    }
  }

  const handleAnswerSelect = (index: number) => {
    if (showResult || timeRemaining === 0 || isFinished) return
    setSelectedAnswer(index)
  }

  const handleSubmit = async () => {
    if (timeRemaining === 0 || isFinished) return
    
    if (selectedAnswer === null) {
      // If no answer selected, mark as incorrect
      setShowResult(true)
      return
    }

    const isCorrect = selectedAnswer === questions[currentQuestion].correct
    if (isCorrect) {
      setScore(score + 1)
    }

    setShowResult(true)
  }

  const handleNext = () => {
    if (timeRemaining === 0) {
      // If time's up, finish the quiz
      setIsFinished(true)
      return
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setIsFinished(true)
    }
  }

  const handleSaveScore = async () => {
    if (!playerName.trim()) return

    try {
      await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: playerName,
          score: score,
          total: questions.length,
        }),
      })
      setNameSubmitted(true)
    } catch (error) {
      console.error('Error saving score:', error)
    }
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading questions...</p>
        </div>
      </div>
    )
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-6 text-indigo-600">
            Gdansk Mosque Quiz
          </h1>
          <div className="space-y-4 mb-6">
            <div className="text-center">
              <p className="text-lg text-gray-700 mb-2">
                Welcome to the quiz!
              </p>
              <p className="text-gray-600 mb-4">
                You will have <span className="font-semibold text-indigo-600">1 minute</span> to complete all {questions.length} questions.
              </p>
              <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Instructions:</span>
                </p>
                <ul className="text-sm text-gray-600 mt-2 space-y-1 list-disc list-inside">
                  <li>Select your answer for each question</li>
                  <li>Click "Submit Answer" to confirm</li>
                  <li>The quiz will automatically finish when time runs out</li>
                  <li>You can only take this quiz once</li>
                </ul>
              </div>
            </div>
          </div>
          <button
            onClick={() => setQuizStarted(true)}
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 text-lg font-semibold transition-colors"
          >
            Start Quiz
          </button>
        </div>
      </div>
    )
  }

  if (isFinished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-6 text-indigo-600">
            Quiz Complete!
          </h1>
          <div className="text-center mb-6">
            <p className="text-2xl font-semibold text-gray-800 mb-2">
              Your Score: {score} / {questions.length}
            </p>
            <p className="text-lg text-gray-600">
              {((score / questions.length) * 100).toFixed(0)}% Correct
            </p>
          </div>

          {!nameSubmitted ? (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                onClick={handleSaveScore}
                disabled={!playerName.trim()}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Save Score
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-green-600 text-center font-semibold">
                Score saved successfully!
              </p>
              <Link
                href="/leaderboard"
                className="block w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 text-center transition-colors"
              >
                View Leaderboard
              </Link>
            </div>
          )}
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-indigo-600">
                Gdansk Mosque Quiz
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span
                    className={`text-lg font-semibold ${
                      timeRemaining <= 10 ? 'text-red-600' : 'text-gray-700'
                    }`}
                  >
                    {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <span className="text-sm text-gray-600">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
            {!isFinished && (
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-1000 ${
                    timeRemaining <= 10 ? 'bg-red-500' : 'bg-indigo-500'
                  }`}
                  style={{ width: `${(timeRemaining / 60) * 100}%` }}
                ></div>
              </div>
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
              {question.question}
            </h2>

            <div className="space-y-3">
              {question.options.map((option, index) => {
                let buttonClass =
                  'w-full text-left p-4 rounded-lg border-2 transition-all duration-200 '
                if (showResult) {
                  if (index === question.correct) {
                    buttonClass += 'bg-green-100 border-green-500 text-green-800'
                  } else if (index === selectedAnswer && index !== question.correct) {
                    buttonClass += 'bg-red-100 border-red-500 text-red-800'
                  } else {
                    buttonClass += 'bg-gray-50 border-gray-200 text-gray-600'
                  }
                } else {
                  if (selectedAnswer === index) {
                    buttonClass += 'bg-indigo-100 border-indigo-500 text-indigo-800'
                  } else {
                    buttonClass += 'bg-white border-gray-300 text-gray-800 hover:border-indigo-300 hover:bg-indigo-50'
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showResult || timeRemaining === 0}
                    className={buttonClass}
                  >
                    <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex justify-end items-center">
            {!showResult ? (
              <button
                onClick={handleSubmit}
                disabled={selectedAnswer === null || timeRemaining === 0}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
