import { renderHook, waitFor } from "@testing-library/react";
import { useWords } from "@/hooks/use-words";

const makeWord = (i: number) => ({
	word: `word${i}`,
	ipa: "/wɜːd/",
	pos: "noun",
	vietnamese: "từ",
	definition: "A unit of language.",
	example: `"word${i} in a sentence."`,
});

const TWENTY_WORDS = Array.from({ length: 20 }, (_, i) => makeWord(i));

describe("useWords", () => {
	afterEach(() => vi.restoreAllMocks());

	it("returns 20 words on successful fetch", async () => {
		vi.spyOn(globalThis, "fetch").mockResolvedValue(
			new Response(JSON.stringify(TWENTY_WORDS), { status: 200 }),
		);

		const { result } = renderHook(() => useWords());

		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(fetch).toHaveBeenCalledWith("/words.json", expect.any(Object));
		expect(result.current.words).toHaveLength(20);
		expect(result.current.error).toBeNull();
	});

	it("sets error state when fetch rejects", async () => {
		vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("network error"));

		const { result } = renderHook(() => useWords());

		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(result.current.words).toHaveLength(0);
		expect(result.current.error).toBeInstanceOf(Error);
	});

	it("sets error state on non-ok response", async () => {
		vi.spyOn(globalThis, "fetch").mockResolvedValue(
			new Response(null, { status: 404 }),
		);

		const { result } = renderHook(() => useWords());

		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(result.current.error).toBeInstanceOf(Error);
	});
});
