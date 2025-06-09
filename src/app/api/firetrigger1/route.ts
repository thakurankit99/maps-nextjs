import { NextResponse } from 'next/server';
import { triggerFireAlarm } from '../../../lib/fireAlarmState';

export async function GET() {
  try {
    console.log('🔥 Fire trigger requested at:', new Date().toISOString());
    console.log('🔥 Environment:', process.env.NODE_ENV);
    console.log('🔥 Platform:', process.env.VERCEL ? 'Vercel' : 'Local');

    // Trigger the fire alarm sequence
    const fireState = triggerFireAlarm();

    console.log('🔥 Fire alarm triggered, new state:', fireState);

    return NextResponse.json({
      success: true,
      message: 'Fire emergency evacuation sequence initiated',
      alert: 'Fire detected - sequential evacuation guidance active',
      sequence: 'started',
      timestamp: fireState.triggeredAt,
      status: 'active',
      evacuationSteps: {
        step1: 'Navigate to assembly point (10 seconds)',
        step2: 'Follow guided exit path (10 seconds)',
        step3: 'Return to normal (after 20 seconds total)'
      },
      fireState: fireState,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        isVercel: !!process.env.VERCEL,
        timestamp: new Date().toISOString()
      },
      debug: {
        globalStateExists: !!globalThis.fireAlarmState,
        rawState: globalThis.fireAlarmState,
        serverlessNote: 'Sequence timing handled by client-side polling'
      }
    });

  } catch (error) {
    console.error('❌ Error in firetrigger1 API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to trigger fire alarm',
        timestamp: new Date().toISOString(),
        details: error instanceof Error ? error.message : 'Unknown error',
        environment: {
          nodeEnv: process.env.NODE_ENV,
          isVercel: !!process.env.VERCEL
        }
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  // Same functionality as GET for flexibility
  return GET();
}
