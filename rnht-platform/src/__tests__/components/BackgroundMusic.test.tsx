import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { BackgroundMusic } from "@/components/effects/BackgroundMusic";

// Mock lucide-react
vi.mock("lucide-react", () => ({
  Music2: (props: any) => <svg data-testid="music-icon" {...props} />,
  VolumeX: (props: any) => <svg data-testid="volume-x-icon" {...props} />,
}));

describe("BackgroundMusic", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the audio element with correct attributes", () => {
    const { container } = render(<BackgroundMusic />);
    const audio = container.querySelector("audio");
    expect(audio).toBeInTheDocument();
    expect(audio).toHaveAttribute("src", "/devotional-music.mp3");
    expect(audio).toHaveAttribute("loop");
    expect(audio).toHaveAttribute("preload", "auto");
  });

  it("renders the toggle button", () => {
    render(<BackgroundMusic />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("initially shows muted state with correct aria-label", () => {
    render(<BackgroundMusic />);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", "Play background music");
    expect(button).toHaveAttribute("title", "Play devotional music");
  });

  it("shows VolumeX icon when not playing", () => {
    render(<BackgroundMusic />);
    expect(screen.getByTestId("volume-x-icon")).toBeInTheDocument();
  });

  it("plays music when button is clicked", async () => {
    const { container } = render(<BackgroundMusic />);
    const button = screen.getByRole("button");
    const audio = container.querySelector("audio") as HTMLAudioElement;

    await act(async () => {
      fireEvent.click(button);
    });

    expect(audio.play).toHaveBeenCalled();
  });

  it("shows Music2 icon after playing", async () => {
    render(<BackgroundMusic />);
    const button = screen.getByRole("button");

    await act(async () => {
      fireEvent.click(button);
    });

    expect(screen.getByTestId("music-icon")).toBeInTheDocument();
  });

  it("updates aria-label when playing", async () => {
    render(<BackgroundMusic />);
    const button = screen.getByRole("button");

    await act(async () => {
      fireEvent.click(button);
    });

    expect(button).toHaveAttribute("aria-label", "Mute background music");
    expect(button).toHaveAttribute("title", "Mute music");
  });

  it("pauses music when clicked while playing", async () => {
    const { container } = render(<BackgroundMusic />);
    const button = screen.getByRole("button");
    const audio = container.querySelector("audio") as HTMLAudioElement;

    // Start playing
    await act(async () => {
      fireEvent.click(button);
    });

    // Click again to pause
    await act(async () => {
      fireEvent.click(button);
    });

    expect(audio.pause).toHaveBeenCalled();
  });

  it("reverts to muted state after pausing", async () => {
    render(<BackgroundMusic />);
    const button = screen.getByRole("button");

    // Play
    await act(async () => {
      fireEvent.click(button);
    });

    // Pause
    await act(async () => {
      fireEvent.click(button);
    });

    expect(button).toHaveAttribute("aria-label", "Play background music");
    expect(screen.getByTestId("volume-x-icon")).toBeInTheDocument();
  });

  it("has gradient background when playing", async () => {
    render(<BackgroundMusic />);
    const button = screen.getByRole("button");

    await act(async () => {
      fireEvent.click(button);
    });

    // Check inline style attribute directly since jsdom may not parse gradients into style property
    const bg = button.getAttribute("style") || button.style.cssText;
    expect(bg).toContain("linear-gradient");
  });

  it("has dark background when not playing", () => {
    render(<BackgroundMusic />);
    const button = screen.getByRole("button");
    const bg = button.getAttribute("style") || button.style.cssText;
    expect(bg).toMatch(/rgba\(0,\s*0,\s*0,\s*0\.5\)/);
  });

  it("auto-plays on first document click interaction", async () => {
    const { container } = render(<BackgroundMusic />);
    const audio = container.querySelector("audio") as HTMLAudioElement;

    await act(async () => {
      fireEvent.click(document);
    });

    expect(audio.play).toHaveBeenCalled();
  });

  it("sets volume to 0.15 when playing", async () => {
    const { container } = render(<BackgroundMusic />);
    const button = screen.getByRole("button");
    const audio = container.querySelector("audio") as HTMLAudioElement;

    await act(async () => {
      fireEvent.click(button);
    });

    expect(audio.volume).toBe(0.15);
  });

  it("button has fixed positioning classes", () => {
    render(<BackgroundMusic />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("fixed", "bottom-4", "right-4", "z-50");
  });
});
