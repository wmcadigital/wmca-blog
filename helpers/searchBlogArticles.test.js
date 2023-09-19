import searchBlogArticles from "./searchBlogArticles";

const blogArticle1 = {
  Id: 1,
  Name: "Blog Article 1",
  Introduction: "The boomerang when thrown flies back...",
};

const blogArticle2 = {
  Id: 2,
  Name: "Blog Article 2",
  Introduction: "This is the introductory text of blog article 2...",
};

const blogArticle3 = {
  Id: 3,
  Name: "Blog Article 3",
  Introduction: "You rang M'lord...",
};

const blogArticle4 = {
  Id: 4,
  Name: "Blog Article 4",
  Introduction: "A bent stick can behave like a boomerang...",
};

const blogArticle5 = {
  Id: 5,
  Name: "Blog Article 5",
  Introduction: "Here comes the boom!!!!",
};

const mockBlogArticles = [
  blogArticle1,
  blogArticle2,
  blogArticle3,
  blogArticle4,
  blogArticle5,
];

describe("searchBlogArticles", () => {
  it("returns matching blog articles that have the provided search term", () => {
    expect(searchBlogArticles(mockBlogArticles, "boomerang")).toEqual([
      blogArticle1,
      blogArticle4,
    ]);
  });

  it("returns matching blog articles that have the provided search term regardless of case", () => {
    expect(searchBlogArticles(mockBlogArticles, "BoomeRang")).toEqual([
      blogArticle1,
      blogArticle4,
    ]);
  });

  it("returns no matching blog articles if there are none that match the search term", () => {
    expect(searchBlogArticles(mockBlogArticles, "Jupiter")).toEqual([]);
  });

  it("search works on word boundaries - 1", () => {
    expect(searchBlogArticles(mockBlogArticles, "rang")).toEqual([
      blogArticle3,
    ]);
  });

  it("search works on word boundaries - 2", () => {
    expect(searchBlogArticles(mockBlogArticles, "boom")).toEqual([
      blogArticle5,
    ]);
  });
});
