import { useCallback, useEffect, useRef, useState } from "react";

export const useSpeech = (): {
	speak: (text: string) => void;
	cancel: () => void;
	isPlaying: boolean;
} => {
	const [isPlaying, setIsPlaying] = useState(false);
	const voicesChangedRef = useRef<(() => void) | null>(null);

	const doSpeak = useCallback((text: string) => {
		const utter = new SpeechSynthesisUtterance(text);
		utter.lang = "en-US";
		utter.rate = 0.85;
		utter.onstart = () => setIsPlaying(true);
		utter.onend = () => setIsPlaying(false);
		utter.onerror = () => setIsPlaying(false);
		window.speechSynthesis.speak(utter);
	}, []);

	const speak = useCallback(
		(text: string) => {
			if (!("speechSynthesis" in window)) return;
			window.speechSynthesis.cancel();

			if (window.speechSynthesis.getVoices().length > 0) {
				doSpeak(text);
			} else {
				const once = () => {
					window.speechSynthesis.removeEventListener("voiceschanged", once);
					voicesChangedRef.current = null;
					doSpeak(text);
				};
				voicesChangedRef.current = once;
				window.speechSynthesis.addEventListener("voiceschanged", once);
			}
		},
		[doSpeak],
	);

	const cancel = useCallback(() => {
		if (!("speechSynthesis" in window)) return;
		if (voicesChangedRef.current) {
			window.speechSynthesis.removeEventListener(
				"voiceschanged",
				voicesChangedRef.current,
			);
			voicesChangedRef.current = null;
		}
		window.speechSynthesis.cancel();
		setIsPlaying(false);
	}, []);

	useEffect(() => () => cancel(), [cancel]);

	return { speak, cancel, isPlaying };
};
