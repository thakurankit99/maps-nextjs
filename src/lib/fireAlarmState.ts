// Shared fire alarm state management
export interface FireAlarmState {
  isActive: boolean;
  triggeredAt: Date | null;
  sequence: 'normal' | 'exit1' | 'exit2';
}

// Global state using globalThis to ensure persistence across API calls
declare global {
  var fireAlarmState: FireAlarmState | undefined;
}

// Initialize global state if it doesn't exist
if (!globalThis.fireAlarmState) {
  globalThis.fireAlarmState = {
    isActive: false,
    triggeredAt: null,
    sequence: 'normal'
  };
}

// URLs for the evacuation sequence
export const mapUrls = {
  normal: "https://app.mappedin.com/map/67af9483845fda000bf299c3",
  exit1: "https://app.mappedin.com/map/67af9483845fda000bf299c3?location=s_4a807c5e25da4122&floor=m_cdd612a0032a1f74", // Step 1: Assembly point
  exit2: "https://app.mappedin.com/map/67af9483845fda000bf299c3/directions?floor=m_cdd612a0032a1f74&location=s_3283c146d50c32f2&departure=s_304550fe8b33d93b" // Step 2: Guided exit path
};

export function getFireAlarmState(): FireAlarmState {
  return { ...globalThis.fireAlarmState! };
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
    sequence: 'exit1'
  };

  console.log('Fire alarm triggered:', globalThis.fireAlarmState);

  // After 10 seconds, switch to exit path 2
  setTimeout(() => {
    if (globalThis.fireAlarmState?.isActive) {
      globalThis.fireAlarmState.sequence = 'exit2';
      console.log('Fire alarm sequence updated to exit2:', globalThis.fireAlarmState);
    }
  }, 10000);

  // After 20 seconds total, return to normal
  setTimeout(() => {
    globalThis.fireAlarmState = {
      isActive: false,
      triggeredAt: null,
      sequence: 'normal'
    };
    console.log('Fire alarm reset to normal:', globalThis.fireAlarmState);
  }, 20000);

  return { ...globalThis.fireAlarmState };
}

export function resetFireAlarm(): FireAlarmState {
  globalThis.fireAlarmState = {
    isActive: false,
    triggeredAt: null,
    sequence: 'normal'
  };
  return { ...globalThis.fireAlarmState };
}
