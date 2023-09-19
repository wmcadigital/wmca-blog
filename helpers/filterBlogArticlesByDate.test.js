import filterBlogArticlesByDate from "./filterBlogArticlesByDate";

const mockArticles = [
  { Date: "2022-06-01T10:19:26" },
  { Date: "2022-06-09T12:00:16" },
  { Date: "2022-06-13T14:03:44" },
  { Date: "2021-05-31T18:58:12" },
  { Date: "2022-05-28T18:28:00" },
  { Date: "2021-12-01T19:19:21" },
  { Date: "2021-09-17T11:00:00" },
  {},
];

describe("filterBlogArticlesByDate", () => {
  beforeAll(() => {
    jest.useFakeTimers("modern");
    jest.setSystemTime(new Date(2022, 5, 15).getTime());
  });

  it("filters blog articles returning only those published last week", () => {
    expect(filterBlogArticlesByDate(mockArticles, "updatedLastWeek")).toEqual([
      { Date: "2022-06-09T12:00:16" },
      { Date: "2022-06-13T14:03:44" },
    ]);
  });

  it("filters blog articles returning only those published last month", () => {
    expect(filterBlogArticlesByDate(mockArticles, "updatedLastMonth")).toEqual([
      { Date: "2022-06-01T10:19:26" },
      { Date: "2022-06-09T12:00:16" },
      { Date: "2022-06-13T14:03:44" },
      { Date: "2022-05-28T18:28:00" },
    ]);
  });

  it("filters blog articles returning only those published last year", () => {
    expect(filterBlogArticlesByDate(mockArticles, "updatedLastYear")).toEqual([
      { Date: "2022-06-01T10:19:26" },
      { Date: "2022-06-09T12:00:16" },
      { Date: "2022-06-13T14:03:44" },
      { Date: "2022-05-28T18:28:00" },
      { Date: "2021-12-01T19:19:21" },
      { Date: "2021-09-17T11:00:00" },
    ]);
  });
});
