import { NextRequest, NextResponse } from 'next/server'
import { Evaluator } from '@career-reality-checker/engine'
import type { RealityCheckInput } from '@career-reality-checker/engine'

export async function POST(request: NextRequest) {
  try {
    const input: RealityCheckInput = await request.json()

    // Validate input
    if (!input.profile || !input.goal) {
      return NextResponse.json(
        { error: 'Invalid input: profile and goal are required' },
        { status: 400 }
      )
    }

    // Run evaluation
    const evaluator = new Evaluator()
    const result = evaluator.evaluate(input)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Evaluation error:', error)
    return NextResponse.json(
      { error: 'Failed to evaluate career goal', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

