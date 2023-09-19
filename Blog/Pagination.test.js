import { render, screen, fireEvent } from "@testing-library/react";

import Pagination from "./Pagination";

describe("Pagination", () => {
  it("renders a link to next page and other pages when active page is first page", () => {
    render(<Pagination numberOfPages={8} activePage={0} />);

    const links = screen.getAllByRole("link");

    const activePage = screen.getByText("1");

    expect(activePage.tagName).toEqual("LI");
    expect(links.length).toBe(8);
    expect(links[0].innerHTML).toEqual("2");
    expect(links[1].innerHTML).toEqual("3");
    expect(links[2].innerHTML).toEqual("4");
    expect(links[3].innerHTML).toEqual("5");
    expect(links[4].innerHTML).toEqual("6");
    expect(links[5].innerHTML).toEqual("7");
    expect(links[6].innerHTML).toEqual("8");
    expect(links[7].innerHTML).toContain("Next page");
  });

  it("renders a link to previous page and other pages when active page is last page", () => {
    render(<Pagination numberOfPages={8} activePage={7} />);

    const links = screen.getAllByRole("link");

    const activePage = screen.getByText("8");

    expect(activePage.tagName).toEqual("LI");
    expect(links.length).toBe(8);
    expect(links[0].innerHTML).toEqual("1");
    expect(links[1].innerHTML).toEqual("2");
    expect(links[2].innerHTML).toEqual("3");
    expect(links[3].innerHTML).toEqual("4");
    expect(links[4].innerHTML).toEqual("5");
    expect(links[5].innerHTML).toEqual("6");
    expect(links[6].innerHTML).toEqual("7");
    expect(links[7].innerHTML).toContain("Previous page");
  });

  it("renders a link to previous, next, other pages when active page is not last page", () => {
    render(<Pagination numberOfPages={8} activePage={4} />);

    const links = screen.getAllByRole("link");

    const activePage = screen.getByText("5");

    expect(activePage.tagName).toEqual("LI");
    expect(links.length).toBe(9);
    expect(links[0].innerHTML).toEqual("1");
    expect(links[1].innerHTML).toEqual("2");
    expect(links[2].innerHTML).toEqual("3");
    expect(links[3].innerHTML).toEqual("4");
    expect(links[4].innerHTML).toEqual("6");
    expect(links[5].innerHTML).toEqual("7");
    expect(links[6].innerHTML).toEqual("8");
    expect(links[7].innerHTML).toContain("Previous page");
    expect(links[8].innerHTML).toContain("Next page");
  });

  it("clicking on a page link will invoke callback with that page as a parameter", () => {
    const mockCallback = jest.fn();
    render(
      <Pagination numberOfPages={8} activePage={0} callBack={mockCallback} />
    );

    const links = screen.getAllByRole("link");

    fireEvent.click(links[3]);

    expect(mockCallback).toBeCalledWith(4);
  });

  it("clicking on previous page link will invoke callback with previous page as a parameter", () => {
    const mockCallback = jest.fn();
    render(
      <Pagination numberOfPages={8} activePage={7} callBack={mockCallback} />
    );

    const links = screen.getAllByRole("link");

    fireEvent.click(links[7]);

    expect(mockCallback).toBeCalledWith(6);
  });

  it("clicking on next page link will invoke callback with next page as a parameter", () => {
    const mockCallback = jest.fn();
    render(
      <Pagination numberOfPages={8} activePage={4} callBack={mockCallback} />
    );

    const links = screen.getAllByRole("link");

    fireEvent.click(links[8]);

    expect(mockCallback).toBeCalledWith(5);
  });
});
