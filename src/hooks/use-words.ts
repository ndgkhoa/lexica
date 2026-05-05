import { useEffect, useState } from "react";
import type { Word } from "@/types/word";

interface WordsState {
	words: Word[];
	loading: boolean;
	error: Error | null;
}

export const useWords = (): WordsState => {
	const [state, setState] = useState<WordsState>({
		words: [],
		loading: true,
		error: null,
	});

	useEffect(() => {
		const controller = new AbortController();

		fetch("/words.json", { signal: controller.signal })
			.then((res) => {
				if (!res.ok) throw new Error(`Failed to load words: ${res.status}`);
				return res.json() as Promise<Word[]>;
			})
			.then((words) => setState({ words, loading: false, error: null }))
			.catch((err: unknown) => {
				if (err instanceof Error && err.name === "AbortError") return;
				setState({
					words: [],
					loading: false,
					error: err instanceof Error ? err : new Error(String(err)),
				});
			});

		return () => controller.abort();
	}, []);

	return state;
};
