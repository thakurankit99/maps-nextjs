import { NextResponse } from 'next/server';
import { getFireAlarmState, setFireAlarmState, mapUrls } from '../../../lib/fireAlarmState';

export async function GET() {
  try {
    const fireAlarmState = getFireAlarmState();
    const currentUrl = mapUrls[fireAlarmState.sequence];

    console.log('Fire status requested:', fireAlarmState);

    return NextResponse.json({
      isActive: fireAlarmState.isActive,
      sequence: fireAlarmState.sequence,
      mapUrl: currentUrl,
      triggeredAt: fireAlarmState.triggeredAt,
      showAlert: fireAlarmState.isActive,
      alertMessage: fireAlarmState.isActive ? 'Fire detected - sequential evacuation guidance active' : null,
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

    const updates: any = {};

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

  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to update fire status',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
