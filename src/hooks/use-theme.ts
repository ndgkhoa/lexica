import { useCallback, useEffect, useState } from "react";

type Theme = "light" | "dark";

const getInitialTheme = (): Theme => {
	if (typeof window === "undefined") return "light";
	const stored = localStorage.getItem("lexica-theme");
	if (stored === "light" || stored === "dark") return stored;
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
};

export const useTheme = (): { theme: Theme; toggle: () => void } => {
	const [theme, setTheme] = useState<Theme>(getInitialTheme);

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
		localStorage.setItem("lexica-theme", theme);
	}, [theme]);

	const toggle = useCallback(
		() => setTheme((t) => (t === "dark" ? "light" : "dark")),
		[],
	);

	return { theme, toggle };
};
