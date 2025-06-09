// Shared fire alarm state management
export interface FireAlarmState {
  isActive: boolean;
  triggeredAt: Date | null;
  sequence: 'normal' | 'exit1' | 'exit2';
  manualStop: boolean; // Track if manually stopped
}

// Global state using globalThis to ensure persistence across API calls
declare global {
  // eslint-disable-next-line no-var
  var fireAlarmState: FireAlarmState | undefined;
}

// Initialize global state if it doesn't exist
if (!globalThis.fireAlarmState) {
  globalThis.fireAlarmState = {
    isActive: false,
    triggeredAt: null,
    sequence: 'normal',
    manualStop: false
  };
}

// URLs for the evacuation sequence
export const mapUrls = {
  normal: "https://app.mappedin.com/map/67af9483845fda000bf299c3",
  exit1: "https://app.mappedin.com/map/67af9483845fda000bf299c3?location=s_4a807c5e25da4122&floor=m_cdd612a0032a1f74", // Step 1: Assembly point
  exit2: "https://app.mappedin.com/map/67af9483845fda000bf299c3/directions?floor=m_cdd612a0032a1f74&location=s_3283c146d50c32f2&departure=s_304550fe8b33d93b" // Step 2: Guided exit path
};

export function getFireAlarmState(): FireAlarmState {
  const state = globalThis.fireAlarmState!;

  // If fire alarm is active and not manually stopped, calculate current sequence based on elapsed time
  if (state.isActive && state.triggeredAt && !state.manualStop) {
    const elapsed = Date.now() - new Date(state.triggeredAt).getTime();

    if (elapsed >= 30000) {
      // After 30 seconds (20s exit1 + 10s exit2), stay on exit2 until manually stopped
      if (state.sequence !== 'exit2') {
        globalThis.fireAlarmState.sequence = 'exit2';
        console.log('Fire alarm sequence updated to exit2 - staying until manual stop');
      }
    } else if (elapsed >= 20000) {
      // After 20 seconds, switch to exit2 for 10 seconds
      if (state.sequence !== 'exit2') {
        globalThis.fireAlarmState.sequence = 'exit2';
        console.log('Fire alarm sequence auto-updated to exit2');
      }
    }
    // First 20 seconds remain as exit1
  }

  return { ...globalThis.fireAlarmState };
}

export function setFireAlarmState(newState: Partial<FireAlarmState>): FireAlarmState {
  globalThis.fireAlarmState = { ...globalThis.fireAlarmState!, ...newState };
  return { ...globalThis.fireAlarmState };
}

export function triggerFireAlarm(): FireAlarmState {
  // Start the fire alarm sequence
  globalThis.fireAlarmState = {
    isActive: true,
    triggeredAt: new Date(),
    sequence: 'exit1',
    manualStop: false // Reset manual stop flag
  };

  console.log('Fire alarm triggered:', globalThis.fireAlarmState);

  // Note: In serverless environments, we rely on client-side timing
  // The client will handle the sequence progression via polling

  return { ...globalThis.fireAlarmState };
}

export function stopFireAlarm(): FireAlarmState {
  // Manually stop the fire alarm
  globalThis.fireAlarmState = {
    isActive: false,
    triggeredAt: null,
    sequence: 'normal',
    manualStop: true
  };

  console.log('Fire alarm manually stopped:', globalThis.fireAlarmState);
  return { ...globalThis.fireAlarmState };
}

export function resetFireAlarm(): FireAlarmState {
  globalThis.fireAlarmState = {
    isActive: false,
    triggeredAt: null,
    sequence: 'normal',
    manualStop: false
  };
  return { ...globalThis.fireAlarmState };
}
