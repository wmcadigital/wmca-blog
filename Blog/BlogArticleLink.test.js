import { render } from "@testing-library/react";

import BlogArticleLink from "./BlogArticleLink";

describe("BlogArticleLink", () => {
  it("renders blog article link as expected", () => {
    const { container } = render(
      <BlogArticleLink
        name="Blog Article Name"
        publishDate="2019-10-30T16:24:45"
        introductionText="<p>Paragraph 1</p><p>Paragraph 2</p><p>Paragrpah 3</p>"
      />
    );

    const articleTitle = container.getElementsByClassName(
      "wmcads-search-result__title"
    )[0];
    const articleDate = container.getElementsByClassName(
      "wmcads-search-result__date"
    )[0];
    const articleIntroText = container.getElementsByClassName(
      "wmcads-search-result__excerpt"
    )[0];

    expect(articleTitle.innerHTML).toEqual("Blog Article Name");
    expect(articleDate.innerHTML).toEqual("Wednesday 30 October 2019");
    expect(articleIntroText.innerHTML).toEqual("Paragraph 1...");
  });
});
