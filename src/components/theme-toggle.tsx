interface ThemeToggleProps {
	theme: "light" | "dark";
	onToggle: () => void;
}

export const ThemeToggle = ({ theme, onToggle }: ThemeToggleProps) => (
	<button
		type="button"
		aria-label="Toggle dark mode"
		onClick={onToggle}
		className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-(--color-border) bg-(--color-surface) text-(--color-text-secondary) shadow-(--shadow-btn) transition-[background,color,transform] duration-150 hover:bg-(--color-surface-raised) focus-visible:outline-(--color-accent) focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-92"
	>
		{theme === "light" ? (
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<circle cx="12" cy="12" r="5" />
				<line x1="12" y1="1" x2="12" y2="3" />
				<line x1="12" y1="21" x2="12" y2="23" />
				<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
				<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
				<line x1="1" y1="12" x2="3" y2="12" />
				<line x1="21" y1="12" x2="23" y2="12" />
				<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
				<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
			</svg>
		) : (
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
			</svg>
		)}
	</button>
);
