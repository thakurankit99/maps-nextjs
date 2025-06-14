import { NextResponse } from 'next/server';
import { getFireAlarmState, setFireAlarmState, mapUrls } from '../../../lib/fireAlarmState';

export async function GET() {
  try {
    const fireAlarmState = getFireAlarmState();
    const currentUrl = mapUrls[fireAlarmState.sequence];

    console.log('Fire status requested:', fireAlarmState);

    // Calculate elapsed time and current phase
    let elapsedTime = 0;
    let currentPhase = 'normal';
    let timeRemaining = 0;
    let alertMessage = null;

    if (fireAlarmState.isActive && fireAlarmState.triggeredAt) {
      elapsedTime = Date.now() - new Date(fireAlarmState.triggeredAt).getTime();

      if (elapsedTime < 20000) {
        currentPhase = 'exit1';
        timeRemaining = 20000 - elapsedTime;
        alertMessage = `Fire detected - Exit Route 1 active (${Math.ceil(timeRemaining/1000)}s remaining)`;
      } else if (elapsedTime < 30000) {
        currentPhase = 'exit2';
        timeRemaining = 30000 - elapsedTime;
        alertMessage = `Fire detected - Exit Route 2 active (${Math.ceil(timeRemaining/1000)}s remaining)`;
      } else {
        currentPhase = 'exit2_continuous';
        timeRemaining = -1; // Continuous until manual stop
        alertMessage = 'Fire detected - Exit Route 2 active (Manual stop required)';
      }
    }

    return NextResponse.json({
      isActive: fireAlarmState.isActive,
      sequence: fireAlarmState.sequence,
      mapUrl: currentUrl,
      triggeredAt: fireAlarmState.triggeredAt,
      showAlert: fireAlarmState.isActive,
      alertMessage: alertMessage,
      elapsedTime,
      currentPhase,
      timeRemaining,
      manualStop: fireAlarmState.manualStop,
      timing: {
        exit1Duration: 20000, // 20 seconds
        exit2Duration: 10000, // 10 seconds
        continuousAfter: 30000, // Stay on exit2 after 30 seconds
        requiresManualStop: elapsedTime >= 30000 && fireAlarmState.isActive
      },
      timestamp: new Date().toISOString(),
      debug: {
        globalStateExists: !!globalThis.fireAlarmState,
        rawState: globalThis.fireAlarmState
      }
    });

  } catch (error) {
    console.error('Error in fire-status API:', error);
    return NextResponse.json(
      {
        error: 'Failed to get fire status',
        timestamp: new Date().toISOString(),
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Allow updating the fire state manually if needed
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { isActive, sequence } = body;

    const updates: Partial<{ isActive: boolean; sequence: 'normal' | 'exit1' | 'exit2'; triggeredAt: Date | null }> = {};

    if (typeof isActive === 'boolean') {
      updates.isActive = isActive;
    }

    if (sequence && ['normal', 'exit1', 'exit2'].includes(sequence)) {
      updates.sequence = sequence;
    }

    if (!isActive) {
      updates.triggeredAt = null;
    }

    const updatedState = setFireAlarmState(updates);

    return NextResponse.json({
      success: true,
      message: 'Fire status updated',
      currentState: updatedState
    });

  } catch {
    return NextResponse.json(
      {
        error: 'Failed to update fire status',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
