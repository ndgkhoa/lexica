# Web Speech API (SpeechSynthesis) Research Report

**Date:** 2026-05-04 | **CWD:** /Users/nguyendangkhoa/workspace/personal/lexica

## Executive Summary

Web Speech API (`SpeechSynthesis`) is a stable, widely-supported native browser API for TTS. Baseline widely available since Sept 2018. Recommended for vocabulary learning apps with custom React hook wrapper. No external dependencies needed for basic use.

---

## 1. Browser Support

**Status:** Broadly supported across modern browsers.

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | Desktop & Android |
| Firefox | ✅ Full | Desktop & mobile |
| Safari | ✅ Full | macOS & iOS |
| iOS Safari | ✅ Full | Native implementation |
| Android Chrome | ✅ Full | Native implementation |
| Edge | ✅ Full | Chromium-based |

**Known Variance:** Voice quality/count varies by OS. macOS/iOS use system voices; Android/Linux rely on TTS engines. Fallback to default voice works universally.

**Accessibility:** No permission prompts required. No Permissions-Policy restrictions (unlike Speech Recognition).

---

## 2. React Hook Pattern (Custom Hook)

**Recommended Pattern:** `useSpeech()` or `useTextToSpeech()` hook wrapping native API.

### Basic Hook Structure

```javascript
import { useEffect, useRef, useState, useCallback } from 'react';

export function useSpeech() {
  const synthRef = useRef(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    setIsSupported(!!synthRef.current);

    // Load voices (may async load on first call)
    const loadVoices = () => {
      if (synthRef.current) {
        setVoices(synthRef.current.getVoices());
      }
    };

    loadVoices();
    
    if (synthRef.current?.onvoiceschanged !== undefined) {
      synthRef.current.onvoiceschanged = loadVoices;
    }

    return () => {
      if (synthRef.current?.cancel) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const speak = useCallback((text, options = {}) => {
    if (!synthRef.current) return;

    synthRef.current.cancel(); // Stop any current speech
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = options.voice || voices[0];
    utterance.rate = options.rate ?? 1;
    utterance.pitch = options.pitch ?? 1;
    utterance.volume = options.volume ?? 1;
    utterance.lang = options.lang || 'en-US';

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      console.error('Speech error:', e.error);
      setIsSpeaking(false);
      options.onError?.(e);
    };

    synthRef.current.speak(utterance);
  }, [voices]);

  const stop = useCallback(() => {
    synthRef.current?.cancel();
    setIsSpeaking(false);
  }, []);

  return { speak, stop, isSpeaking, isSupported, voices };
}
```

**Hook Benefits:**
- Cleanup on unmount (cancels speech)
- Voice state management
- Event handling encapsulated
- Reusable across components

---

## 3. Voice Selection & English Voices

### Get Available Voices

```javascript
const voices = window.speechSynthesis.getVoices();
// Returns array of SpeechSynthesisVoice objects

// Each voice has:
// - name: string (e.g., "Google UK English Female")
// - lang: string (e.g., "en-GB")
// - default: boolean
// - localService: boolean
// - uri: optional string
```

### Filter for English & Pick Preferred

```javascript
function selectEnglishVoice(voices, preferred = 'US') {
  // preferred: 'US' | 'GB' | 'AU' | 'IN' | ...
  
  const langMap = {
    'US': 'en-US',
    'GB': 'en-GB',
    'AU': 'en-AU',
    'IN': 'en-IN',
  };

  const targetLang = langMap[preferred];
  
  // Try preferred first
  let voice = voices.find(v => v.lang === targetLang && !v.name.includes('Google'));
  
  // Fallback to any English
  voice = voice || voices.find(v => v.lang.startsWith('en-'));
  
  // Final fallback to default
  voice = voice || voices.find(v => v.default);
  
  return voice;
}
```

**Voice Load Timing:** `getVoices()` may return empty on first call (async load). Listen to `voiceschanged` event:

```javascript
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = () => {
    console.log('Voices loaded:', speechSynthesis.getVoices());
  };
}
```

---

## 4. Autoplay on Tap (User Gesture Requirement)

**Browsers allow speech synthesis only within user gesture context (click/tap/keydown).**

```javascript
// WORKS - called from click handler
button.addEventListener('click', () => {
  useSpeech.speak(text); // ✅ User gesture context
});

// FAILS - no user gesture
setTimeout(() => {
  useSpeech.speak(text); // ❌ Will be blocked
}, 1000);
```

### Safe Implementation with React

```javascript
export function VocabCard({ word }) {
  const { speak } = useSpeech();

  const handleSpeakClick = (e) => {
    e.stopPropagation();
    speak(word); // Called directly from click, safe
  };

  return (
    <button onClick={handleSpeakClick}>
      🔊 Pronounce
    </button>
  );
}
```

**No explicit user permission dialog required** — browser auto-allows if gesture context exists.

---

## 5. Rate, Pitch, Volume for Vocabulary Learning

### Sensible Defaults

```javascript
// Vocab learning optimized
const learningDefaults = {
  rate: 0.8,      // Slower for comprehension
  pitch: 1.0,     // Neutral
  volume: 1.0,    // Full volume
  lang: 'en-US',
};

// Standard speech
const normalDefaults = {
  rate: 1.0,      // Normal
  pitch: 1.0,
  volume: 1.0,
};

// Fast review
const reviewDefaults = {
  rate: 1.3,      // Faster
  pitch: 1.0,
  volume: 1.0,
};
```

**Ranges:**
- `rate`: 0.1–10 (default 1)
- `pitch`: 0–2 (default 1)
- `volume`: 0–1 (default 1)

**Recommendation:** For vocab app, use rate 0.8–0.9 for initial learning, allow user speed adjustment.

---

## 6. Error Handling

### Possible Errors

```javascript
utterance.onerror = (event) => {
  switch (event.error) {
    case 'network':
      console.error('Network error');
      break;
    case 'synthesis-unavailable':
      console.error('TTS not available on this device');
      break;
    case 'voice-unavailable':
      console.error('Selected voice unavailable');
      break;
    case 'aborted':
      // Normal (user clicked stop)
      break;
    case 'service-not-allowed':
      console.error('User denied permission');
      break;
  }
};
```

### Feature Detection

```javascript
if (!window.speechSynthesis) {
  // Fallback to alternative
  return null;
}

// Check voice availability
const voices = window.speechSynthesis.getVoices();
if (voices.length === 0) {
  console.warn('No voices available');
}
```

---

## 7. Lightweight Alternatives (npm packages)

### When to Use Web Speech API vs. External Library

| Aspect | Web Speech API | External Lib |
|--------|----------------|--------------|
| Bundle size | 0 bytes (native) | +20–100KB |
| Browser support | Modern browsers | May support older |
| Voice quality | System voices | Cloud APIs (Google, AWS) |
| Offline | ✅ Yes | ❌ Usually requires internet |
| Customization | Limited | More options |
| Cost | Free | May charge per request |

### Lightweight Alternatives Mentioned

1. **No lightweight npm needed.** Web Speech API is native, standard since 2018.
2. **If cloud quality needed:** Consider AWS Polly, Google Cloud TTS (requires backend).
3. **If older browser support needed:** `react-speech-kit` (wrapper around Web Speech API, adds fallbacks).

**Recommendation for vocabulary app:** Use native Web Speech API with custom hook. Zero dependencies, instant, offline-capable. Revisit only if UX feedback shows voice quality issues.

---

## Summary & Recommendations

| Item | Recommendation |
|------|-----------------|
| **Implementation** | Custom React hook `useSpeech()` |
| **Browser Support** | Modern browsers; safe to use |
| **Voice Selection** | Filter by lang, pick preferred English variant |
| **Autoplay** | Call from click/tap handler; no permissions needed |
| **Defaults** | rate=0.8, pitch=1, volume=1 for learning |
| **Error Handling** | Check `isSupported`, listen to `onerror` |
| **External Lib** | Not needed; Web Speech API is sufficient |

---

## Unresolved Questions

- Performance impact of getVoices() on large voice lists (unlikely issue)?
- Exact voice availability variance across macOS/iOS/Android (need testing)?
- Whether user can enable/disable speech synthesis in browser privacy settings (assumed no permission gate)?
