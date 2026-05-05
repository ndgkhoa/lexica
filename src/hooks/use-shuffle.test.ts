import { act, renderHook } from "@testing-library/react";
import { useShuffle } from "@/hooks/use-shuffle";
import type { Word } from "@/types/word";

const makeWords = (n: number): Word[] =>
	Array.from({ length: n }, (_, i) => ({
		word: `word${i}`,
		ipa: "",
		pos: "noun",
		vietnamese: "",
		definition: "",
		example: "",
	}));

describe("useShuffle", () => {
	it("returns a valid initial index", () => {
		const words = makeWords(5);
		const { result } = renderHook(() => useShuffle(words));
		expect(result.current.currentIdx).toBeGreaterThanOrEqual(0);
		expect(result.current.currentIdx).toBeLessThan(5);
	});

	it("produces no immediate consecutive repeats over 1000 next() calls", () => {
		const words = makeWords(5);
		const { result } = renderHook(() => useShuffle(words));
		let prev = result.current.currentIdx;

		for (let i = 0; i < 1000; i++) {
			act(() => result.current.next());
			const curr = result.current.currentIdx;
			expect(curr).not.toBe(prev);
			prev = curr;
		}
	});

	it("does nothing when words array is empty", () => {
		const { result } = renderHook(() => useShuffle([]));
		act(() => result.current.next());
		expect(result.current.currentIdx).toBe(0);
	});
});
