import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const scores = await prisma.score.findMany({
      orderBy: [
        { score: 'desc' },
        { createdAt: 'asc' },
      ],
      take: 100, // Top 100 scores
    })

    return NextResponse.json(scores)
  } catch (error) {
    console.error('Error fetching scores:', error)
    return NextResponse.json({ error: 'Failed to fetch scores' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, score, total } = body

    if (!name || typeof score !== 'number' || typeof total !== 'number') {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    const newScore = await prisma.score.create({
      data: {
        name: name.trim(),
        score,
        total,
      },
    })

    return NextResponse.json(newScore, { status: 201 })
  } catch (error) {
    console.error('Error saving score:', error)
    return NextResponse.json({ error: 'Failed to save score' }, { status: 500 })
  }
}
