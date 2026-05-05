import { useCallback, useEffect, useRef, useState } from "react";
import type { Word } from "@/types/word";

const buildQueue = (excludeIdx: number, total: number): number[] => {
	const indices = Array.from({ length: total }, (_, i) => i).filter(
		(i) => i !== excludeIdx,
	);
	for (let i = indices.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const tmp = indices[i];
		indices[i] = indices[j];
		indices[j] = tmp;
	}
	return indices;
};

export const useShuffle = (
	words: Word[],
): { currentIdx: number; next: () => void } => {
	const [currentIdx, setCurrentIdx] = useState(0);
	const queue = useRef<number[]>([]);
	const initialized = useRef(false);

	useEffect(() => {
		if (words.length === 0 || initialized.current) return;
		initialized.current = true;
		const q = buildQueue(-1, words.length);
		const first = q.pop() ?? 0;
		queue.current = q;
		setCurrentIdx(first);
	}, [words.length]);

	const next = useCallback(() => {
		if (words.length === 0) return;
		if (queue.current.length === 0) {
			queue.current = buildQueue(currentIdx, words.length);
		}
		const idx = queue.current.pop() ?? 0;
		setCurrentIdx(idx);
	}, [currentIdx, words.length]);

	return { currentIdx, next };
};
