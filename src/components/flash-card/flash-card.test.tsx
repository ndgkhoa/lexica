import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FlashCard } from "@/components/flash-card/flash-card";
import type { Word } from "@/types/word";

const WORD: Word = {
	word: "ephemeral",
	level: "B2",
	ipa: "/ɪˈfem.ər.əl/",
	pos: "adjective",
	vietnamese: "phù du",
	definition: "Lasting for a very short time.",
	example: '"Gone within a week."',
};

const renderCard = (isPlaying = false) => {
	const onSpeak = vi.fn();
	render(<FlashCard word={WORD} onSpeak={onSpeak} isPlaying={isPlaying} />);
	const scene = screen.getByRole("button", { name: /flashcard/i });
	const soundBtn = screen.getByRole("button", { name: /play pronunciation/i });
	return { scene, soundBtn, onSpeak };
};

describe("FlashCard", () => {
	it("renders the word on the front face", () => {
		renderCard();
		// Word appears on both faces; verify at least one is the large front display
		const matches = screen.getAllByText("ephemeral");
		expect(matches.length).toBeGreaterThanOrEqual(1);
		expect(matches[0]).toBeInTheDocument();
	});

	it("clicking the scene toggles the flipped class on the inner element", async () => {
		const { scene } = renderCard();
		// biome-ignore lint/style/noNonNullAssertion: inner always exists
		const inner = scene.firstElementChild!;

		expect(inner.className).not.toMatch(/flipped/);
		await userEvent.click(scene);
		expect(inner.className).toMatch(/flipped/);
		await userEvent.click(scene);
		expect(inner.className).not.toMatch(/flipped/);
	});

	it("clicking the sound button calls onSpeak without flipping the card", async () => {
		const { scene, soundBtn, onSpeak } = renderCard();
		// biome-ignore lint/style/noNonNullAssertion: inner always exists
		const inner = scene.firstElementChild!;

		await userEvent.click(soundBtn);

		expect(onSpeak).toHaveBeenCalledOnce();
		expect(inner.className).not.toMatch(/flipped/);
	});
});
