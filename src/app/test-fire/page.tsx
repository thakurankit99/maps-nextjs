'use client';

import { useState } from 'react';
import Link from 'next/link';

// Type definitions for window extensions
declare global {
  interface Window {
    checkFireAlarm?: () => void;
  }
}

export default function TestFire() {
  const [response, setResponse] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  const triggerFireAlarm = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/firetrigger1');
      const data = await res.json();
      setResponse(data);
    } catch {
      setResponse({ error: 'Failed to trigger fire alarm' });
    } finally {
      setLoading(false);
    }
  };

  const checkFireStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/fire-status');
      const data = await res.json();
      setResponse(data);
    } catch {
      setResponse({ error: 'Failed to check fire status' });
    } finally {
      setLoading(false);
    }
  };

  const stopFireAlarm = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stop-fire-alarm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      setResponse(data);

      // Trigger immediate status check if available
      if (typeof window !== 'undefined' && window.checkFireAlarm) {
        setTimeout(() => {
          window.checkFireAlarm?.();
        }, 100);
      }
    } catch {
      setResponse({ error: 'Failed to stop fire alarm' });
    } finally {
      setLoading(false);
    }
  };

  const resetFireAlarm = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/fire-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: false,
          sequence: 'normal'
        })
      });
      const data = await res.json();
      setResponse(data);
    } catch {
      setResponse({ error: 'Failed to reset fire alarm' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Fire Alarm Test Page</h1>
      <p>Use this page to test the fire alarm functionality.</p>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={triggerFireAlarm}
          disabled={loading}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: '#ff4444',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Loading...' : 'Trigger Fire Alarm'}
        </button>

        <button
          onClick={checkFireStatus}
          disabled={loading}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: '#4444ff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Loading...' : 'Check Fire Status'}
        </button>

        <button
          onClick={stopFireAlarm}
          disabled={loading}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Loading...' : 'Stop Fire Alarm'}
        </button>

        <button
          onClick={resetFireAlarm}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#44ff44',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Loading...' : 'Reset Fire Alarm'}
        </button>
      </div>

      {response && (
        <div style={{
          padding: '15px',
          backgroundColor: '#f5f5f5',
          border: '1px solid #ddd',
          borderRadius: '5px',
          marginTop: '20px'
        }}>
          <h3>API Response:</h3>
          <pre style={{ whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginTop: '30px' }}>
        <h2>Instructions:</h2>
        <ol>
          <li><strong>Trigger Fire Alarm:</strong> Calls <code>/api/firetrigger1</code> to start the fire alarm sequence</li>
          <li><strong>Check Fire Status:</strong> Calls <code>/api/fire-status</code> to see current fire alarm state</li>
          <li><strong>Stop Fire Alarm:</strong> Calls <code>/api/stop-fire-alarm</code> to manually stop the active fire alarm</li>
          <li><strong>Reset Fire Alarm:</strong> Manually resets the fire alarm to normal state</li>
        </ol>
        
        <h3>Expected Evacuation Sequence:</h3>
        <ul>
          <li>🚨 <strong>Immediate:</strong> Fire alert appears with sound and vibration</li>
          <li>📍 <strong>Step 1 (0-10s):</strong> Map shows assembly point location</li>
          <li>🚪 <strong>Step 2 (10-20s):</strong> Map shows guided path from assembly point to exit</li>
          <li>✅ <strong>After 20s:</strong> Emergency cleared, returns to normal view</li>
        </ul>

        <div style={{
          padding: '15px',
          backgroundColor: '#fff3e0',
          border: '1px solid #ff9800',
          borderRadius: '8px',
          marginTop: '15px'
        }}>
          <h4 style={{ color: '#f57c00', margin: '0 0 10px 0' }}>🔥 Evacuation Logic</h4>
          <p style={{ margin: 0, color: '#ef6c00' }}>
            This is a <strong>sequential evacuation process</strong>, not alternative routes.
            Step 1 guides users to a safe assembly point, then Step 2 shows the safest exit path from that point.
          </p>
        </div>

        <h3>Modern UI Features:</h3>
        <ul>
          <li>🎨 <strong>Integrated layout</strong> - Alert appears above map (not as popup)</li>
          <li>📊 <strong>Progress bar</strong> showing emergency sequence progress</li>
          <li>🔊 <strong>Audio alerts</strong> using Web Audio API</li>
          <li>📱 <strong>Vibration feedback</strong> on mobile devices</li>
          <li>🌊 <strong>Animated sound waves</strong> and pulsing effects</li>
          <li>📍 <strong>Status indicators</strong> with real-time updates</li>
          <li>🎯 <strong>Smooth slide animations</strong> (down/up transitions)</li>
          <li>🎨 <strong>Gradient background</strong> with glassmorphism effect</li>
          <li>📱 <strong>Responsive design</strong> for all screen sizes</li>
        </ul>

        <div style={{
          padding: '15px',
          backgroundColor: '#e3f2fd',
          border: '1px solid #2196f3',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <h4 style={{ color: '#1976d2', margin: '0 0 10px 0' }}>💡 Layout Change</h4>
          <p style={{ margin: 0, color: '#1565c0' }}>
            The fire alert now integrates seamlessly above the map iframe instead of appearing as a popup overlay.
            This creates a more natural user experience where the alert becomes part of the page layout.
          </p>
        </div>

        <p><Link href="/" style={{ color: '#0066cc' }}>← Back to Main Page</Link></p>
      </div>
    </div>
  );
}
