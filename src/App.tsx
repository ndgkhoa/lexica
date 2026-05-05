import { useEffect } from "react";
import { useWords } from "@/hooks/use-words";
import { useShuffle } from "@/hooks/use-shuffle";
import { useSpeech } from "@/hooks/use-speech";
import { useTheme } from "@/hooks/use-theme";
import { FlashCard } from "@/components/flash-card/flash-card";
import { TopBar } from "@/components/top-bar";
import { ThemeToggle } from "@/components/theme-toggle";
import { NextWordButton } from "@/components/next-word-button";

export default function App() {
	const { words, loading, error } = useWords();
	const { currentIdx, next } = useShuffle(words);
	const { speak, cancel, isPlaying } = useSpeech();
	const { theme, toggle } = useTheme();

	const currentWord = words[currentIdx];

	// biome-ignore lint/correctness/useExhaustiveDependencies: fire once per word change
	useEffect(() => {
		if (!currentWord) return;
		speak(currentWord.word);
		return () => cancel();
	}, [currentWord?.word]);

	const handleSoundClick = () => {
		if (isPlaying) cancel();
		else if (currentWord) speak(currentWord.word);
	};

	if (loading) {
		return (
			<div className="min-h-dvh flex items-center justify-center text-(--color-text-muted)">
				Loading…
			</div>
		);
	}

	if (error || !currentWord) {
		return (
			<div className="min-h-dvh flex items-center justify-center text-(--color-text-secondary)">
				Failed to load words.
			</div>
		);
	}

	return (
		<>
			<TopBar>
				<ThemeToggle theme={theme} onToggle={toggle} />
			</TopBar>
			<div aria-live="polite" aria-atomic="true" className="sr-only">
				{currentWord.word}
			</div>
			<main className="flex flex-col items-center gap-8 w-full">
				<FlashCard word={currentWord} onSpeak={handleSoundClick} isPlaying={isPlaying} />
				<NextWordButton onClick={next} />
			</main>
		</>
	);
}
