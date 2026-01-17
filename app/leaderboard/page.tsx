'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Score {
  id: number
  name: string
  score: number
  total: number
  createdAt: string
}

export default function Leaderboard() {
  const [scores, setScores] = useState<Score[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchScores()
  }, [])

  const fetchScores = async () => {
    try {
      const res = await fetch('/api/scores')
      const data = await res.json()
      setScores(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching scores:', error)
      setLoading(false)
    }
  }

  const getRankEmoji = (index: number) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return `${index + 1}.`
  }

  const getPercentage = (score: number, total: number) => {
    return ((score / total) * 100).toFixed(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-indigo-600">Leaderboard</h1>
            <Link
              href="/"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Take Quiz
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading leaderboard...</p>
            </div>
          ) : scores.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No scores yet. Be the first to take the quiz!</p>
              <Link
                href="/"
                className="inline-block mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Start Quiz
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Rank</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Score</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Percentage</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.map((score, index) => (
                    <tr
                      key={score.id}
                      className={`border-b border-gray-100 hover:bg-indigo-50 transition-colors ${
                        index < 3 ? 'bg-yellow-50' : ''
                      }`}
                    >
                      <td className="py-4 px-4">
                        <span className="text-lg font-semibold">
                          {getRankEmoji(index)}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-medium text-gray-800">{score.name}</td>
                      <td className="py-4 px-4 text-center">
                        <span className="font-semibold text-indigo-600">
                          {score.score} / {score.total}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="font-semibold text-gray-700">
                          {getPercentage(score.score, score.total)}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right text-sm text-gray-600">
                        {new Date(score.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
