import { act, renderHook } from "@testing-library/react";
import { useSpeech } from "@/hooks/use-speech";
import { triggerVoicesChanged } from "@/test/setup";

describe("useSpeech", () => {
	beforeEach(() => {
		vi.mocked(speechSynthesis.speak).mockClear();
		vi.mocked(speechSynthesis.cancel).mockClear();
	});

	it("does not speak immediately when voices are empty; speaks after voiceschanged", () => {
		// voices array is empty at this point (setup initialises it empty)
		const { result } = renderHook(() => useSpeech());

		act(() => result.current.speak("hello"));
		expect(speechSynthesis.speak).not.toHaveBeenCalled();

		act(() => triggerVoicesChanged());
		expect(speechSynthesis.speak).toHaveBeenCalledOnce();
	});

	it("speaks immediately when voices are already loaded", () => {
		// voices array was populated by the previous test's triggerVoicesChanged
		const { result } = renderHook(() => useSpeech());

		act(() => result.current.speak("world"));
		expect(speechSynthesis.speak).toHaveBeenCalledOnce();
	});

	it("cancel() calls speechSynthesis.cancel and sets isPlaying false", () => {
		const { result } = renderHook(() => useSpeech());

		act(() => result.current.cancel());
		expect(speechSynthesis.cancel).toHaveBeenCalled();
		expect(result.current.isPlaying).toBe(false);
	});
});
