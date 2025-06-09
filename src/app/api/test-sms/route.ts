import { NextResponse } from 'next/server';
import { sendTestAlert, checkTwilioConfig } from '../../../lib/twilioService';

export async function GET() {
  try {
    console.log('📱 Test SMS requested at:', new Date().toISOString());

    // Check Twilio configuration
    const twilioConfig = checkTwilioConfig();
    console.log('📱 Twilio configuration:', twilioConfig);

    if (!twilioConfig.configured) {
      return NextResponse.json({
        success: false,
        error: 'Twilio not configured',
        missing: twilioConfig.missing,
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    // Send test SMS
    console.log('📱 Sending test SMS...');
    const smsResult = await sendTestAlert();
    console.log('📱 Test SMS result:', smsResult);

    return NextResponse.json({
      success: smsResult.success,
      message: smsResult.success ? 'Test SMS sent successfully' : 'Failed to send test SMS',
      smsResult: smsResult,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error in test-sms API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send test SMS',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message } = body;

    console.log('📱 Custom test SMS requested with message:', message);

    const twilioConfig = checkTwilioConfig();
    if (!twilioConfig.configured) {
      return NextResponse.json({
        success: false,
        error: 'Twilio not configured',
        missing: twilioConfig.missing,
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    const smsResult = await sendTestAlert(message);

    return NextResponse.json({
      success: smsResult.success,
      message: smsResult.success ? 'Custom test SMS sent successfully' : 'Failed to send custom test SMS',
      smsResult: smsResult,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error in custom test-sms API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send custom test SMS',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
