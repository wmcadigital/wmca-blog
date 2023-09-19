import { render, act } from "@testing-library/react";
import { create } from "react-test-renderer";

import BlogArticles from "./BlogArticles";
import mockBlogDocument from "./mockBlogDocument.json"

jest.mock("../api/getData",() => ({
  __esModule: true,
  default: () => new Promise((resolve) => setTimeout(resolve, 1000)).then(() => mockBlogDocument)
}));

describe("BlogArticles", () => {
  it("shows loading indicator on first render and NOT when document is loaded", async () => {
    const { container } = render(<BlogArticles />);

    expect(container.getElementsByClassName("wmcads-loader").length).toBe(1);

    await act(() => new Promise((resolve) => setTimeout(resolve, 1500)));

    expect(container.getElementsByClassName("wmcads-loader").length).toBe(0);
  });

  it("snapshot when blog document is loaded", async () => {
    const renderer = create(<BlogArticles />);

    await act(() => new Promise((resolve) => setTimeout(resolve, 1500)));

    expect(renderer.toJSON()).toMatchSnapshot();
  });
});
