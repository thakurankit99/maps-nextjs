import { NextResponse } from 'next/server';
import { stopFireAlarm } from '../../../lib/fireAlarmState';

export async function POST() {
  try {
    console.log('🛑 Stop fire alarm requested at:', new Date().toISOString());

    // Stop the fire alarm
    const fireState = stopFireAlarm();
    console.log('🛑 Fire alarm stopped, new state:', fireState);

    return NextResponse.json({
      success: true,
      message: 'Fire alarm stopped successfully',
      alert: 'Fire alarm has been manually stopped',
      action: 'stopped',
      timestamp: new Date().toISOString(),
      fireState: fireState,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        isVercel: !!process.env.VERCEL,
        timestamp: new Date().toISOString()
      },
      debug: {
        globalStateExists: !!globalThis.fireAlarmState,
        rawState: globalThis.fireAlarmState,
        manualStop: fireState.manualStop
      }
    });

  } catch (error) {
    console.error('❌ Error stopping fire alarm:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to stop fire alarm',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Also support GET for easy testing
export async function GET() {
  return POST();
}
