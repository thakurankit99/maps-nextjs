// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const emergencyContactNumber = process.env.EMERGENCY_CONTACT_NUMBER;

export interface SMSResponse {
  success: boolean;
  messageSid?: string;
  error?: string;
  timestamp: string;
}

export async function sendFireEmergencyAlert(): Promise<SMSResponse> {
  const timestamp = new Date().toISOString();

  try {
    // Check if Twilio is configured
    if (!accountSid || !authToken) {
      console.error('❌ Twilio not configured - missing credentials');
      return {
        success: false,
        error: 'Twilio not configured - missing credentials',
        timestamp
      };
    }

    if (!twilioPhoneNumber || !emergencyContactNumber) {
      console.error('❌ Missing phone number configuration');
      return {
        success: false,
        error: 'Missing phone number configuration',
        timestamp
      };
    }

    // Create emergency message - Short for trial account
    const emergencyMessage = `OMAPS has detected fire alert! please visit https://omaps.unihubconnect.com/`;

    console.log('📱 Sending fire emergency SMS to:', emergencyContactNumber);
    console.log('📱 From number:', twilioPhoneNumber);
    console.log('📱 Message length:', emergencyMessage.length, 'characters');

    // Send SMS using Twilio REST API
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: twilioPhoneNumber,
        To: emergencyContactNumber,
        Body: emergencyMessage,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Twilio API error:', errorData);
      throw new Error(`Twilio API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ Emergency SMS sent successfully:', result.sid);
    console.log('📱 Full Twilio response:', result);

    return {
      success: true,
      messageSid: result.sid,
      timestamp
    };

  } catch (error) {
    console.error('❌ Failed to send emergency SMS:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp
    };
  }
}

export async function sendTestAlert(customMessage?: string): Promise<SMSResponse> {
  const timestamp = new Date().toISOString();

  try {
    if (!accountSid || !authToken || !twilioPhoneNumber || !emergencyContactNumber) {
      return {
        success: false,
        error: 'Twilio not configured',
        timestamp
      };
    }

    const testMessage = customMessage || `OMAPS test alert - system working! Visit https://omaps.unihubconnect.com/`;

    // Send SMS using Twilio REST API
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: twilioPhoneNumber,
        To: emergencyContactNumber,
        Body: testMessage,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Twilio API error:', errorData);
      throw new Error(`Twilio API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ Test SMS sent successfully:', result.sid);

    return {
      success: true,
      messageSid: result.sid,
      timestamp
    };

  } catch (error) {
    console.error('❌ Failed to send test SMS:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp
    };
  }
}

// Configuration check function
export function checkTwilioConfig(): { configured: boolean; missing: string[] } {
  const missing: string[] = [];
  
  if (!accountSid) missing.push('TWILIO_ACCOUNT_SID');
  if (!authToken) missing.push('TWILIO_AUTH_TOKEN');
  if (!twilioPhoneNumber) missing.push('TWILIO_PHONE_NUMBER');
  if (!emergencyContactNumber) missing.push('EMERGENCY_CONTACT_NUMBER');
  
  return {
    configured: missing.length === 0,
    missing
  };
}
