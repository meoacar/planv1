import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await req.json()

    // Update user with onboarding data
    await db.user.update({
      where: { id: session.user.id },
      data: {
        goal: data.goal,
        currentWeight: data.currentWeight,
        targetWeight: data.targetWeight,
        height: data.height,
        activityLevel: data.activityLevel,
        dailyWaterGoal: data.dailyWaterGoal,
        averageSleep: data.averageSleep,
        biggestChallenge: data.biggestChallenge,
        onboardingCompleted: true,
        onboardingCompletedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Onboarding complete error:', error)
    return NextResponse.json(
      { error: 'Failed to complete onboarding' },
      { status: 500 }
    )
  }
}
