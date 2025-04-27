import { NextRequest, NextResponse } from 'next/server';
import { steps } from '@/data/roadmap';

// POST: Mark a roadmap step as complete
export async function POST(req: NextRequest) {
    const { id } = await req.json();

    if (!id) {
        return NextResponse.json({ message: 'Step ID is required' }, { status: 400 });
    }

    if (typeof id !== 'number') {
        return NextResponse.json({ message: 'Step ID must be a number' }, { status: 400 });
    }

    // Find the step in the array
    const stepIndex = steps.findIndex((step) => step.id === id);
    if (stepIndex === -1) {
        return NextResponse.json({ message: 'Step not found' }, { status: 404 });
    }

    // Mark step as completed and update progress
    steps[stepIndex].completed = true;
    steps[stepIndex].progress = 100;

    return NextResponse.json({ message: 'Step marked as complete', step: steps[stepIndex] });
}
