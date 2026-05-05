import type { Word } from "@/types/word";

interface FlashCardBackProps {
	word: Word;
}

export const FlashCardBack = ({ word }: FlashCardBackProps) => (
	<div className="relative flex h-full w-full flex-col items-start justify-center px-9 py-8">
		<span
			className="absolute top-4 right-5 text-[14px] text-(--color-text-muted) italic"
			style={{ fontFamily: "var(--font-display)" }}
		>
			{word.word}
		</span>

		<div className="flex w-full flex-col items-start gap-3.5">
			<span
				className="rounded-sm bg-(--color-accent-subtle) px-2.5 py-1 text-[10px] font-semibold tracking-widest text-(--color-accent) uppercase"
				style={{ fontFamily: "var(--font-ui)" }}
			>
				{word.pos}
			</span>

			<p
				className="text-[18px] text-(--color-text-primary) leading-[1.6]"
				style={{ fontFamily: "var(--font-ui)" }}
			>
				{word.definition}
			</p>

			<div className="h-px w-8 bg-(--color-border)" />

			<p
				className="text-[17px] text-(--color-text-secondary) italic leading-[1.6]"
				style={{ fontFamily: "var(--font-display)" }}
			>
				{word.example}
			</p>
		</div>
	</div>
);
