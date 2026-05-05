interface TopBarProps {
	children: React.ReactNode;
}

export const TopBar = ({ children }: TopBarProps) => (
	<header
		className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-5 py-4"
		style={{ pointerEvents: "none" }}
	>
		<span
			className="text-[22px] font-semibold opacity-85 text-(--color-text-primary) tracking-[-0.02em]"
			style={{ fontFamily: "var(--font-display)", pointerEvents: "auto" }}
		>
			Lexica
		</span>
		<div style={{ pointerEvents: "auto" }}>{children}</div>
	</header>
);
