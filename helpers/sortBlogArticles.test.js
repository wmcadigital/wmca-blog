import sortBlogArticles from "./sortBlogArticles";

const blogArticle1 = {
  Id: 1,
  Name: "Blog Article 1",
  Date: "2020-03-25T15:53:15",
};

const blogArticle2 = {
  Id: 2,
  Name: "Blog Article 2",
  Date: "2022-05-12T12:12:01",
};

const blogArticle3 = {
  Id: 3,
  Name: "Blog Article 3",
  Date: "2020-02-11T21:09:34",
};

const blogArticle4 = {
  Id: 4,
  Name: "Blog Article 4",
  Date: "2019-12-23T22:22:17",
};

const blogArticle5 = {
  Id: 5,
  Name: "Blog Article 5",
  Date: "2019-08-01T08:00:00",
};

const mockBlogArticles = [
  blogArticle1,
  blogArticle2,
  blogArticle3,
  blogArticle4,
  blogArticle5,
];

describe("sortBlogArticles", () => {
  it("sorts blog articles in ascending order", () => {
    expect(sortBlogArticles(mockBlogArticles, true)).toEqual([
      blogArticle5,
      blogArticle4,
      blogArticle3,
      blogArticle1,
      blogArticle2,
    ]);
  });

  it("sorts blog articles in descending order", () => {
    expect(sortBlogArticles(mockBlogArticles)).toEqual([
      blogArticle2,
      blogArticle1,
      blogArticle3,
      blogArticle4,
      blogArticle5,
    ]);
  });
});
