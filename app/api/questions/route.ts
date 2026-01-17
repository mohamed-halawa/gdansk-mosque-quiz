import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Sample questions - in production, these would be in the database
const sampleQuestions = [
  {
    question: 'What is the capital of Poland?',
    options: ['Warsaw', 'Krakow', 'Gdansk', 'Wroclaw'],
    correct: 0,
  },
  {
    question: 'Which month does Ramadan typically occur?',
    options: ['January', 'March', 'May', 'Varies each year'],
    correct: 3,
  },
  {
    question: 'How many daily prayers are there in Islam?',
    options: ['3', '4', '5', '6'],
    correct: 2,
  },
  {
    question: 'What is the holy book of Islam?',
    options: ['Bible', 'Torah', 'Quran', 'Vedas'],
    correct: 2,
  },
  {
    question: 'What is the name of the pilgrimage to Mecca?',
    options: ['Umrah', 'Hajj', 'Zakat', 'Salah'],
    correct: 1,
  },
]

export async function GET() {
  try {
    // Try to get questions from database first
    const dbQuestions = await prisma.question.findMany()

    if (dbQuestions.length > 0) {
      // Return questions from database
      const formatted = dbQuestions.map((q) => ({
        id: q.id,
        question: q.question,
        options: JSON.parse(q.options),
        correct: q.correct,
      }))
      return NextResponse.json(formatted)
    }

    // If no questions in DB, return sample questions
    // You can seed the database with these later
    return NextResponse.json(
      sampleQuestions.map((q, idx) => ({
        id: idx + 1,
        ...q,
      }))
    )
  } catch (error) {
    console.error('Error fetching questions:', error)
    // Fallback to sample questions if DB error
    return NextResponse.json(
      sampleQuestions.map((q, idx) => ({
        id: idx + 1,
        ...q,
      }))
    )
  }
}
