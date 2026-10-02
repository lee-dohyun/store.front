import { describe, it, expect } from "vitest";
import { topLevelCategoryLinks } from "./main-categories";

describe("topLevelCategoryLinks", () => {
  it("keeps only top-level categories, ordered by sortOrder", () => {
    const links = topLevelCategoryLinks([
      { id: 9002, name: "뷰티", parentId: null, sortOrder: 2 },
      { id: 9101, name: "상의", parentId: 9001, sortOrder: 1 },
      { id: 9001, name: "패션의류", parentId: null, sortOrder: 1 },
    ]);
    expect(links.map((l) => l.label)).toEqual(["패션의류", "뷰티"]);
  });

  it("links each category to the product list filtered by that category", () => {
    const [link] = topLevelCategoryLinks([{ id: 9003, name: "식품", parentId: null, sortOrder: 3 }]);
    expect(link).toEqual({ id: 9003, label: "식품", href: "https://product.posselect.com/?category=9003" });
  });

  it("falls back to id order when sortOrder is missing", () => {
    const links = topLevelCategoryLinks([
      { id: 2, name: "B", parentId: null },
      { id: 1, name: "A", parentId: null },
    ]);
    expect(links.map((l) => l.id)).toEqual([1, 2]);
  });
});
