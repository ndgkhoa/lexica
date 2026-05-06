import { useEffect } from "react";
import { ErrorState } from "@/components/error-state";
import { FlashCard } from "@/components/flash-card/flash-card";
import { LoadingSpinner } from "@/components/loading-spinner";
import { NextWordButton } from "@/components/next-word-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { TopBar } from "@/components/top-bar";
import { useShuffle } from "@/hooks/use-shuffle";
import { useSpeech } from "@/hooks/use-speech";
import { useTheme } from "@/hooks/use-theme";
import { useWords } from "@/hooks/use-words";

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
			<>
				<TopBar>
					<ThemeToggle theme={theme} onToggle={toggle} />
				</TopBar>
				<main className="flex w-full flex-col items-center gap-8">
					<LoadingSpinner />
				</main>
			</>
		);
	}

	if (error || !currentWord) {
		return (
			<>
				<TopBar>
					<ThemeToggle theme={theme} onToggle={toggle} />
				</TopBar>
				<ErrorState />
			</>
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
			<main className="flex w-full flex-col items-center gap-8">
				<FlashCard
					word={currentWord}
					onSpeak={handleSoundClick}
					isPlaying={isPlaying}
				/>
				<NextWordButton onClick={next} />
			</main>
		</>
	);
}
