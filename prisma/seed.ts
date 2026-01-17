import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const questions = [
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
  {
    question: 'What does "Salam" mean in Arabic?',
    options: ['Hello', 'Peace', 'Thank you', 'Goodbye'],
    correct: 1,
  },
  {
    question: 'Which direction do Muslims face during prayer?',
    options: ['North', 'East', 'West', 'Mecca (Qibla)'],
    correct: 3,
  },
  {
    question: 'What is the first month of the Islamic calendar?',
    options: ['Ramadan', 'Muharram', 'Shawwal', 'Dhul-Hijjah'],
    correct: 1,
  },
]

async function main() {
  console.log('Seeding database...')

  // Clear existing questions
  await prisma.question.deleteMany()

  // Create new questions
  for (const question of questions) {
    await prisma.question.create({
      data: {
        question: question.question,
        options: JSON.stringify(question.options),
        correct: question.correct,
      },
    })
  }

  console.log(`Seeded ${questions.length} questions successfully!`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
