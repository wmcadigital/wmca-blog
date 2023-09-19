import filterBlogArticlesByArea from "./filterBlogArticlesByArea";

const mockArticles = [
  { ArticleArea: ["Birmingham", "Solihull"] },
  { ArticleArea: ["Walsall"] },
  { ArticleArea: ["Sandwell"] },
  { ArticleArea: ["Wolverhampton"] },
  { ArticleArea: ["Birmingham", "Walsall"] },
  { ArticleArea: ["Dudley", "Sandwell"] },
  { ArticleArea: ["Dudley"] },
  {},
];

describe("filterBlogArticlesByArea", () => {
  it("filters blog articles by area", () => {
    expect(
      filterBlogArticlesByArea(mockArticles, ["Sandwell", "Walsall"])
    ).toEqual([
      { ArticleArea: ["Walsall"] },
      { ArticleArea: ["Sandwell"] },
      { ArticleArea: ["Birmingham", "Walsall"] },
      { ArticleArea: ["Dudley", "Sandwell"] },
    ]);
  });
});
