import { NextResponse } from 'next/server';
import { triggerFireAlarm } from '../../../lib/fireAlarmState';
import { sendFireEmergencyAlert, checkTwilioConfig } from '../../../lib/twilioService';

export async function GET() {
  try {
    console.log('🔥 Fire trigger requested at:', new Date().toISOString());
    console.log('🔥 Environment:', process.env.NODE_ENV);
    console.log('🔥 Platform:', process.env.VERCEL ? 'Vercel' : 'Local');

    // Check Twilio configuration
    const twilioConfig = checkTwilioConfig();
    console.log('📱 Twilio configuration:', twilioConfig);

    // Trigger the fire alarm sequence
    const fireState = triggerFireAlarm();
    console.log('🔥 Fire alarm triggered, new state:', fireState);

    // Send emergency SMS alert
    let smsResult = null;
    if (twilioConfig.configured) {
      console.log('📱 Sending emergency SMS alert...');
      smsResult = await sendFireEmergencyAlert();
      console.log('📱 SMS result:', smsResult);
    } else {
      console.log('⚠️ Twilio not configured, skipping SMS alert. Missing:', twilioConfig.missing);
    }

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
      smsAlert: smsResult ? {
        sent: smsResult.success,
        messageSid: smsResult.messageSid,
        error: smsResult.error,
        timestamp: smsResult.timestamp
      } : {
        sent: false,
        error: 'Twilio not configured',
        missingConfig: twilioConfig.missing
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        isVercel: !!process.env.VERCEL,
        timestamp: new Date().toISOString()
      },
      debug: {
        globalStateExists: !!globalThis.fireAlarmState,
        rawState: globalThis.fireAlarmState,
        serverlessNote: 'Sequence timing handled by client-side polling',
        twilioConfigured: twilioConfig.configured
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
