import "@testing-library/jest-dom";

// Minimal SpeechSynthesis stub — mirrors the real API shape for tests.
// jsdom doesn't ship Web Speech API; we provide a test double so useSpeech
// can run without errors, and tests can assert on speak/cancel calls.
const listeners: Record<string, Array<() => void>> = { voiceschanged: [] };
const voices: SpeechSynthesisVoice[] = [];

globalThis.speechSynthesis = {
	getVoices: () => voices,
	speak: vi.fn(),
	cancel: vi.fn(),
	pause: vi.fn(),
	resume: vi.fn(),
	pending: false,
	speaking: false,
	paused: false,
	addEventListener: (_: string, cb: EventListenerOrEventListenerObject) => {
		const fn = typeof cb === "function" ? cb : cb.handleEvent.bind(cb);
		listeners.voiceschanged?.push(fn as () => void);
	},
	removeEventListener: (_: string, cb: EventListenerOrEventListenerObject) => {
		const fn = typeof cb === "function" ? cb : cb.handleEvent.bind(cb);
		listeners.voiceschanged =
			listeners.voiceschanged?.filter((x) => x !== fn) ?? [];
	},
	dispatchEvent: () => true,
	onvoiceschanged: null,
} as unknown as SpeechSynthesis;

// Helper tests can call to simulate voices becoming available.
export const triggerVoicesChanged = () => {
	voices.push({} as SpeechSynthesisVoice);
	for (const cb of listeners.voiceschanged ?? []) cb();
};

globalThis.SpeechSynthesisUtterance = class {
	lang = "";
	rate = 1;
	text = "";
	onstart: (() => void) | null = null;
	onend: (() => void) | null = null;
	onerror: (() => void) | null = null;
	constructor(text: string) {
		this.text = text;
	}
} as unknown as typeof SpeechSynthesisUtterance;
