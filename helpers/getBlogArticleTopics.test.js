import getBlogArticleTopics from "./getBlogArticleTopics";

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

describe("getBlogArticleTopics", () => {
  it("should return a sorted list of unique categories", () => {
    expect(getBlogArticleTopics(mockArticles)).toEqual([
      "Commerce",
      "Economics",
      "None",
      "Politics",
      "Religion",
    ]);
  });
});
