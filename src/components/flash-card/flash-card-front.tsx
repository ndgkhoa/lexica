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
	<div className="relative flex h-full w-full flex-col items-center justify-center px-9 py-8">
		<SoundButton isPlaying={isPlaying} onClick={onSpeak} />

		<div className="flex flex-col items-center gap-3 text-center">
			<span
				className="text-(--color-text-primary) leading-[1.1] tracking-tight"
				style={{
					fontFamily: "var(--font-display)",
					fontSize: "clamp(40px, 9vw, 76px)",
				}}
			>
				{word.word}
			</span>

			<span
				className="text-(--color-text-secondary) text-base"
				style={{ fontFamily: "var(--font-ui)" }}
			>
				{word.ipa}
			</span>

			<span
				className="rounded-full bg-(--color-accent-subtle) px-[14px] py-1 font-medium text-[15px] text-(--color-accent)"
				style={{ fontFamily: "var(--font-ui)" }}
			>
				{word.vietnamese}
			</span>
		</div>
	</div>
);
