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

			<div className="flex flex-col items-center gap-2 pt-1">
				<div className="h-px w-6 bg-(--color-border)" />
				<span
					className="text-[20px] text-(--color-text-secondary) italic leading-tight"
					style={{ fontFamily: "var(--font-display)" }}
				>
					{word.vietnamese}
				</span>
			</div>
		</div>
	</div>
);
