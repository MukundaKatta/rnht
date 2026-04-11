import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/layout/Footer";

// Mock next/link
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

describe("Footer", () => {
  it("renders the temple name", () => {
    render(<Footer />);
    expect(
      screen.getByText("Rudra Narayana Hindu Temple")
    ).toBeInTheDocument();
  });

  it("renders contact information", () => {
    render(<Footer />);
    expect(screen.getByText(/512.*545.*0473/)).toBeInTheDocument();
    expect(screen.getByText(/512.*998.*0112/)).toBeInTheDocument();
  });

  it("renders the nonprofit badge", () => {
    render(<Footer />);
    expect(
      screen.getByText("501(c)(3) Registered Nonprofit")
    ).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<Footer />);
    expect(screen.getByText("Book a Pooja")).toBeInTheDocument();
    expect(screen.getByText("Events Calendar")).toBeInTheDocument();
    expect(screen.getByText("Donate")).toBeInTheDocument();
    expect(screen.getByText("About Us")).toBeInTheDocument();
  });

  it("has contentinfo role", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("renders copyright", () => {
    render(<Footer />);
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`${year}`))).toBeInTheDocument();
  });
});
