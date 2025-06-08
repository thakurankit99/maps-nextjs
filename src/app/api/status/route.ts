import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const systemStatus = {
      status: 'operational',
      timestamp: new Date().toISOString(),
      services: {
        mapping: {
          status: 'online',
          lastCheck: new Date().toISOString(),
          responseTime: '120ms'
        },
        navigation: {
          status: 'online',
          lastCheck: new Date().toISOString(),
          responseTime: '85ms'
        },
        alarmSystem: {
          status: 'online',
          lastCheck: new Date().toISOString(),
          responseTime: '45ms'
        },
        database: {
          status: 'online',
          lastCheck: new Date().toISOString(),
          responseTime: '30ms'
        }
      },
      version: '1.0.0',
      uptime: '99.9%',
      environment: process.env.NODE_ENV || 'development'
    };

    return NextResponse.json(systemStatus);
  } catch {
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Failed to fetch system status',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
