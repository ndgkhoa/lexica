interface NextWordButtonProps {
	onClick: () => void;
}

export const NextWordButton = ({ onClick }: NextWordButtonProps) => (
	<button
		type="button"
		aria-label="Load next random word"
		onClick={onClick}
		className="rounded-full h-14 px-8 bg-(--color-accent) text-white text-[15px] font-semibold
			flex items-center gap-2.5 tracking-[0.01em]
			[box-shadow:0_4px_16px_rgba(0,168,150,0.32)]
			hover:bg-(--color-accent-hover) hover:-translate-y-px hover:[box-shadow:0_6px_20px_rgba(0,168,150,0.4)]
			active:scale-96 active:translate-y-0 active:[box-shadow:0_2px_8px_rgba(0,168,150,0.28)]
			focus-visible:outline-2 focus-visible:outline-(--color-accent) focus-visible:outline-offset-[3px]
			transition-[background,box-shadow,transform] duration-150 cursor-pointer will-change-transform"
	>
		Next Word
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
			<line x1="5" y1="12" x2="19" y2="12" />
			<polyline points="12 5 19 12 12 19" />
		</svg>
	</button>
);
