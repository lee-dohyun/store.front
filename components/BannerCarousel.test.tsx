import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import BannerCarousel from "./BannerCarousel";

const banners = [
  { id: 1, title: "Banner 1", subtitle: "sub1", imageUrl: null, link: "/a", bgColor: "#111" },
  { id: 2, title: "Banner 2", subtitle: "sub2", imageUrl: null, link: "/b", bgColor: "#222" },
  { id: 3, title: "Banner 3", subtitle: "sub3", imageUrl: null, link: "/c", bgColor: "#333" },
];

function swipe(container: HTMLElement, startX: number, endX: number) {
  const el = container.firstElementChild as HTMLElement;
  fireEvent.pointerDown(el, { clientX: startX, pointerId: 1 });
  fireEvent.pointerMove(el, { clientX: endX, pointerId: 1 });
  fireEvent.pointerUp(el, { clientX: endX, pointerId: 1 });
}

beforeEach(() => {
  vi.useFakeTimers();
  // Element.setPointerCapture/releasePointerCapture are not implemented in jsdom.
  Element.prototype.setPointerCapture = vi.fn();
  Element.prototype.releasePointerCapture = vi.fn();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("BannerCarousel swipe", () => {
  it("moves to the next banner on a left swipe", () => {
    const { container } = render(<BannerCarousel initialBanners={banners} />);
    const first = screen.getByText(/Banner \d/).textContent;

    swipe(container, 300, 100); // drag left by 200px

    const after = screen.getByText(/Banner \d/).textContent;
    expect(after).not.toBe(first);
  });

  it("moves to the previous banner on a right swipe", () => {
    const { container } = render(<BannerCarousel initialBanners={banners} />);

    swipe(container, 100, 300); // next
    const afterFirstSwipe = screen.getByText(/Banner \d/).textContent;

    swipe(container, 300, 100); // back (left swipe reverses it)

    const afterSecondSwipe = screen.getByText(/Banner \d/).textContent;
    expect(afterSecondSwipe).not.toBe(afterFirstSwipe);
  });

  it("ignores drags shorter than the swipe threshold", () => {
    const { container } = render(<BannerCarousel initialBanners={banners} />);
    const before = screen.getByText(/Banner \d/).textContent;

    swipe(container, 200, 210); // only 10px, below threshold

    const after = screen.getByText(/Banner \d/).textContent;
    expect(after).toBe(before);
  });

  it("suppresses navigation click after a swipe gesture", () => {
    const { container } = render(<BannerCarousel initialBanners={banners} />);
    const link = container.querySelector("a") as HTMLAnchorElement;

    swipe(container, 300, 100);

    const clickEvent = new MouseEvent("click", { bubbles: true, cancelable: true });
    link.dispatchEvent(clickEvent);

    expect(clickEvent.defaultPrevented).toBe(true);
  });
});
