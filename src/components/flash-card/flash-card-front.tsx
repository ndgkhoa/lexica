import { SoundButton } from "@/components/sound-button";
import type { Word } from "@/types/word";

interface FlashCardFrontProps {
	word: Word;
	onSpeak: () => void;
	isPlaying: boolean;
}

export const FlashCardFront = ({
	word,
	onSpeak,
	isPlaying,
}: FlashCardFrontProps) => (
	<div className="relative flex flex-col items-center justify-center w-full h-full px-9 py-8">
		<SoundButton isPlaying={isPlaying} onClick={onSpeak} />

		<div className="flex flex-col items-center gap-3 text-center">
			<span
				className="leading-[1.1] tracking-tight text-[var(--color-text-primary)]"
				style={{
					fontFamily: "var(--font-display)",
					fontSize: "clamp(40px, 9vw, 76px)",
				}}
			>
				{word.word}
			</span>

			<span
				className="text-base text-[var(--color-text-secondary)]"
				style={{ fontFamily: "var(--font-ui)" }}
			>
				{word.ipa}
			</span>

			<span
				className="text-[15px] font-medium text-[var(--color-accent)] bg-[var(--color-accent-subtle)] rounded-full px-[14px] py-1"
				style={{ fontFamily: "var(--font-ui)" }}
			>
				{word.vietnamese}
			</span>
		</div>
	</div>
);
