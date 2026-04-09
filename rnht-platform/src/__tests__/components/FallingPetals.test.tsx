import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { FallingPetals } from "@/components/effects/FallingPetals";

// Mock lucide-react
vi.mock("lucide-react", () => ({
  Flower2: (props: any) => <svg data-testid="flower-icon" {...props} />,
}));

describe("FallingPetals", () => {
  it("renders nothing initially before useEffect runs", () => {
    // Before useEffect, petals array is empty, so component returns null
    // But after render + useEffect, petals are generated
    const { container } = render(<FallingPetals />);
    // After effect runs, the button should be present
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders the toggle button with correct initial aria-label", () => {
    render(<FallingPetals />);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", "Stop falling petals");
  });

  it("renders petals container with aria-hidden", () => {
    const { container } = render(<FallingPetals />);
    const petalsContainer = container.querySelector("[aria-hidden='true']");
    expect(petalsContainer).toBeInTheDocument();
  });

  it("generates 18 petal elements after mount", () => {
    const { container } = render(<FallingPetals />);
    const petalElements = container.querySelectorAll(".falling-petal");
    expect(petalElements.length).toBe(18);
  });

  it("each petal contains an SVG element", () => {
    const { container } = render(<FallingPetals />);
    const petalElements = container.querySelectorAll(".falling-petal");
    petalElements.forEach((petal) => {
      expect(petal.querySelector("svg")).toBeInTheDocument();
    });
  });

  it("hides petals when toggle button is clicked", () => {
    const { container } = render(<FallingPetals />);
    const button = screen.getByRole("button");

    // Initially visible
    expect(container.querySelector("[aria-hidden='true']")).toBeInTheDocument();

    // Click to hide
    fireEvent.click(button);
    expect(container.querySelector("[aria-hidden='true']")).not.toBeInTheDocument();
    expect(button).toHaveAttribute("aria-label", "Start falling petals");
  });

  it("shows petals again when toggle button is clicked twice", () => {
    const { container } = render(<FallingPetals />);
    const button = screen.getByRole("button");

    fireEvent.click(button); // hide
    fireEvent.click(button); // show again

    expect(container.querySelector("[aria-hidden='true']")).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-label", "Stop falling petals");
  });

  it("button has correct title when visible", () => {
    render(<FallingPetals />);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("title", "Stop petals");
  });

  it("button has correct title when hidden", () => {
    render(<FallingPetals />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(button).toHaveAttribute("title", "Show petals");
  });

  it("button has gradient background when petals are visible", () => {
    render(<FallingPetals />);
    const button = screen.getByRole("button");
    // Check inline style attribute for gradient - jsdom may not parse gradient into style property
    const bg = button.getAttribute("style") || button.style.cssText;
    expect(bg).toContain("linear-gradient");
  });

  it("button has dark background when petals are hidden", () => {
    render(<FallingPetals />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    const bg = button.getAttribute("style") || button.style.cssText;
    expect(bg).toMatch(/rgba\(0,\s*0,\s*0,\s*0\.5\)/);
  });

  it("petals have animation styles set", () => {
    const { container } = render(<FallingPetals />);
    const petal = container.querySelector(".falling-petal") as HTMLElement;
    expect(petal).toBeInTheDocument();
    expect(petal.style.top).toBe("-30px");
    expect(petal.style.animationDuration).toBeTruthy();
    expect(petal.style.animationDelay).toBeTruthy();
  });

  it("petal container is fixed and pointer-events-none", () => {
    const { container } = render(<FallingPetals />);
    const petalsContainer = container.querySelector("[aria-hidden='true']");
    expect(petalsContainer).toHaveClass("fixed", "pointer-events-none");
  });

  it("renders the Flower2 icon inside button", () => {
    render(<FallingPetals />);
    expect(screen.getByTestId("flower-icon")).toBeInTheDocument();
  });
});
