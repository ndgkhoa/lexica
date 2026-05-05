import type { Word } from "@/types/word";

interface FlashCardBackProps {
	word: Word;
}

export const FlashCardBack = ({ word }: FlashCardBackProps) => (
	<div className="relative flex flex-col items-start justify-center w-full h-full px-9 py-8">
		<span
			className="absolute top-4 right-5 text-[14px] italic text-[var(--color-text-muted)]"
			style={{ fontFamily: "var(--font-display)" }}
		>
			{word.word}
		</span>

		<div className="flex flex-col items-start gap-3.5 w-full">
			<span
				className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--color-accent)] bg-[var(--color-accent-subtle)] rounded-sm px-2.5 py-1"
				style={{ fontFamily: "var(--font-ui)" }}
			>
				{word.pos}
			</span>

			<p
				className="text-[18px] leading-[1.6] text-[var(--color-text-primary)]"
				style={{ fontFamily: "var(--font-ui)" }}
			>
				{word.definition}
			</p>

			<div className="w-8 h-px bg-[var(--color-border)]" />

			<p
				className="text-[17px] italic leading-[1.6] text-[var(--color-text-secondary)]"
				style={{ fontFamily: "var(--font-display)" }}
			>
				{word.example}
			</p>
		</div>
	</div>
);
