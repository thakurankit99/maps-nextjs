import { NextResponse } from 'next/server';
import { triggerFireAlarm } from '../../../lib/fireAlarmState';

export async function GET() {
  try {
    console.log('Fire trigger requested');

    // Trigger the fire alarm sequence
    const fireState = triggerFireAlarm();

    console.log('Fire alarm triggered, new state:', fireState);

    return NextResponse.json({
      success: true,
      message: 'Fire emergency evacuation sequence initiated',
      alert: 'Fire detected - sequential evacuation guidance active',
      sequence: 'started',
      timestamp: fireState.triggeredAt,
      status: 'active',
      evacuationSteps: {
        step1: 'Navigate to assembly point',
        step2: 'Follow guided exit path'
      },
      fireState: fireState,
      debug: {
        globalStateExists: !!globalThis.fireAlarmState,
        rawState: globalThis.fireAlarmState
      }
    });

  } catch (error) {
    console.error('Error in firetrigger1 API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to trigger fire alarm',
        timestamp: new Date().toISOString(),
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  // Same functionality as GET for flexibility
  return GET();
}
