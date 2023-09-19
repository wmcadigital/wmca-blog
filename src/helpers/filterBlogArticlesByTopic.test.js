import filterBlogArticlesByTopic from "./filterBlogArticlesByTopic";

const mockArticles = [
  { ArticleCategory: "Religion" },
  { ArticleCategory: "Economics" },
  { ArticleCategory: "" },
  { ArticleCategory: "Commerce" },
  { ArticleCategory: "Politics" },
  { ArticleCategory: "Economics" },
  { ArticleCategory: "Religion" },
  {},
];

describe("filterBlogArticlesByTopic", () => {
  it("filters blog articles by category", () => {
    expect(
      filterBlogArticlesByTopic(mockArticles, [
        "Commerce",
        "Politics",
        "None",
      ])
    ).toEqual([
      { ArticleCategory: "" },
      { ArticleCategory: "Commerce" },
      { ArticleCategory: "Politics" },
      {},
    ]);
  });
});
