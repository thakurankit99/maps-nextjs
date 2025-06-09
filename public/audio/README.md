# Fire Alarm Audio

## Required Audio File

Please place the `alert_audio.mp3` file in this directory.

### Audio File Requirements:
- **Filename**: `alert_audio.mp3`
- **Duration**: 18 seconds
- **Format**: MP3
- **Quality**: High quality audio for emergency announcements
- **Volume**: Should be clear and audible for emergency situations

### Audio Behavior:
- Plays automatically when fire alarm is triggered via `/api/firetrigger1`
- Plays the full 18-second audio completely
- After completion, waits 0.5 seconds then repeats
- Continues repeating until fire alarm is manually stopped
- Can be toggled on/off using the audio control button in the fire alert UI

### File Location:
```
ompas-nextjs/public/audio/alert_audio.mp3
```

### Usage:
The audio system will automatically detect and use this file when the fire alarm system is activated.

### Fallback:
If the audio file is missing, the system will log an error but continue to function without audio.
