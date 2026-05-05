import { useEffect, useRef, useState } from "react";
import styles from "@/components/flash-card/flash-card.module.css";
import { FlashCardBack } from "@/components/flash-card/flash-card-back";
import { FlashCardFront } from "@/components/flash-card/flash-card-front";
import type { Word } from "@/types/word";

interface FlashCardProps {
	word: Word;
	onSpeak: () => void;
	isPlaying: boolean;
}

export const FlashCard = ({ word, onSpeak, isPlaying }: FlashCardProps) => {
	const [isFlipped, setIsFlipped] = useState(false);
	const innerRef = useRef<HTMLDivElement>(null);

	// Reset to front without flip-back animation on word change.
	// word.word is an intentional trigger — effect body uses only refs/setters.
	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional trigger
	useEffect(() => {
		const el = innerRef.current;
		if (!el) return;
		el.style.transitionDuration = "0ms";
		setIsFlipped(false);
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				el.style.transitionDuration = "";
			});
		});
	}, [word.word]);

	const handleFlip = () => setIsFlipped((f) => !f);

	const handleKey = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			handleFlip();
		}
	};

	return (
		<>
			{/* div[role="button"]: scene contains a <button> (sound btn), so
			    using <button> here would produce invalid nested-button HTML */}
			{/* biome-ignore lint/a11y/useSemanticElements: nested <button> makes outer <button> invalid */}
			<div
				className={styles.scene}
				role="button"
				tabIndex={0}
				aria-label="Vocabulary flashcard — tap to flip"
				onClick={handleFlip}
				onKeyDown={handleKey}
			>
				<div
					ref={innerRef}
					className={`${styles.inner} ${isFlipped ? styles.flipped : ""}`}
				>
					<div className={styles.face}>
						<FlashCardFront
							word={word}
							onSpeak={onSpeak}
							isPlaying={isPlaying}
						/>
					</div>
					<div className={`${styles.face} ${styles.back}`}>
						<FlashCardBack word={word} />
					</div>
				</div>
			</div>
		</>
	);
};
