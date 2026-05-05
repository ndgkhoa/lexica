interface SoundButtonProps {
	isPlaying: boolean;
	onClick: () => void;
	ariaLabel?: string;
}

export const SoundButton = ({
	isPlaying,
	onClick,
	ariaLabel = "Play pronunciation",
}: SoundButtonProps) => {
	const handleClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		onClick();
	};

	return (
		<button
			type="button"
			aria-label={ariaLabel}
			aria-pressed={isPlaying}
			onClick={handleClick}
			className="absolute top-4 right-4 flex items-center justify-center w-9 h-9 rounded-full bg-transparent transition-colors duration-150 hover:bg-[var(--color-accent-subtle)] hover:text-[var(--color-accent)] active:scale-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] text-[var(--color-text-muted)]"
		>
			{isPlaying ? (
				<svg
					aria-hidden="true"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2.5"
					strokeLinecap="round"
					strokeLinejoin="round"
					style={{ color: "var(--color-accent)" }}
				>
					<polygon
						points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"
						fill="currentColor"
					/>
					<path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
				</svg>
			) : (
				<svg
					aria-hidden="true"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
					<path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
					<path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
				</svg>
			)}
		</button>
	);
};
