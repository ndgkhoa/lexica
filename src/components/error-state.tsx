export const ErrorState = () => (
	<main className="flex min-h-[60dvh] items-center justify-center">
		<div
			role="alert"
			className="error-wrapper flex flex-col items-center gap-3 text-center"
		>
			<svg
				className="error-icon text-(--color-text-muted)"
				width="40"
				height="40"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<path d="M12 9v4m0 4h.01" />
				<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
			</svg>

			<p
				className="text-[15px] text-(--color-text-secondary)"
				style={{ fontFamily: "var(--font-ui)" }}
			>
				Failed to load words.
			</p>

			<button
				type="button"
				onClick={() => window.location.reload()}
				className="mt-1 cursor-pointer text-[13px] text-(--color-accent) underline underline-offset-4 transition-colors duration-150 hover:text-(--color-accent-hover)"
				style={{ fontFamily: "var(--font-ui)" }}
			>
				Try again
			</button>
		</div>
	</main>
);
