interface NextWordButtonProps {
	onClick: () => void;
	label?: string;
	ariaLabel?: string;
}

export const NextWordButton = ({
	onClick,
	label = "Next Word",
	ariaLabel = "Load next random word",
}: NextWordButtonProps) => (
	<button
		type="button"
		aria-label={ariaLabel}
		onClick={onClick}
		className="flex h-14 cursor-pointer items-center gap-2.5 rounded-full bg-(--color-accent) px-8 font-semibold text-[15px] text-white tracking-[0.01em] transition-[background,box-shadow,transform] duration-150 will-change-transform [box-shadow:0_4px_16px_rgba(0,168,150,0.32)] hover:-translate-y-px hover:bg-(--color-accent-hover) focus-visible:outline-(--color-accent) focus-visible:outline-2 focus-visible:outline-offset-[3px] active:translate-y-0 active:scale-96 hover:[box-shadow:0_6px_20px_rgba(0,168,150,0.4)] active:[box-shadow:0_2px_8px_rgba(0,168,150,0.28)]"
	>
		{label}
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<line x1="5" y1="12" x2="19" y2="12" />
			<polyline points="12 5 19 12 12 19" />
		</svg>
	</button>
);
