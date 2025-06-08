import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for alarm status (in production, this would be in a database)
let alarmStatus = {
  fire: false,
  lastUpdated: new Date().toISOString(),
};

export async function GET() {
  try {
    return NextResponse.json({
      fire: alarmStatus.fire,
      lastUpdated: alarmStatus.lastUpdated,
      status: 'success'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch alarm status' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fire } = body;

    if (typeof fire !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid fire status. Must be boolean.' },
        { status: 400 }
      );
    }

    alarmStatus = {
      fire,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json({
      fire: alarmStatus.fire,
      lastUpdated: alarmStatus.lastUpdated,
      status: 'updated'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update alarm status' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  // Toggle the alarm status
  try {
    alarmStatus = {
      fire: !alarmStatus.fire,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json({
      fire: alarmStatus.fire,
      lastUpdated: alarmStatus.lastUpdated,
      status: 'toggled'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to toggle alarm status' },
      { status: 500 }
    );
  }
}
