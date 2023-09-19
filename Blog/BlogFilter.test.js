import {
  render,
  screen,
  fireEvent,
  getAllByRole,
} from "@testing-library/react";

import BlogFilter from "./BlogFilter";

describe("BlogFilter", () => {
  it("renders options to filter by", () => {
    const { container } = render(
      <BlogFilter blogCategories={["Category1", "Category2", "Category3"]} />
    );

    const filters = container.getElementsByClassName(
      "wmcads-accordion__content"
    );

    const optionsAreas = getAllByRole(filters[0], "checkbox");

    expect(optionsAreas[0].getAttribute("value")).toEqual("Birmingham");
    expect(optionsAreas[1].getAttribute("value")).toEqual("Coventry");
    expect(optionsAreas[2].getAttribute("value")).toEqual("Dudley");
    expect(optionsAreas[3].getAttribute("value")).toEqual("Sandwell");
    expect(optionsAreas[4].getAttribute("value")).toEqual("Solihull");
    expect(optionsAreas[5].getAttribute("value")).toEqual("Walsall");
    expect(optionsAreas[6].getAttribute("value")).toEqual("Wolverhampton");
    expect(optionsAreas[7].getAttribute("value")).toEqual("New Constituent");

    const optionsCategories = getAllByRole(filters[1], "checkbox");

    expect(optionsCategories.length).toBe(3);
    expect(optionsCategories[0].getAttribute("value")).toEqual("Category1");
    expect(optionsCategories[1].getAttribute("value")).toEqual("Category2");
    expect(optionsCategories[2].getAttribute("value")).toEqual("Category3");

    const optionsDates = getAllByRole(filters[2], "radio");

    expect(optionsDates.length).toBe(3);
    expect(optionsDates[0].getAttribute("value")).toEqual("updatedLastWeek");
    expect(optionsDates[1].getAttribute("value")).toEqual("updatedLastMonth");
    expect(optionsDates[2].getAttribute("value")).toEqual("updatedLastYear");
  });

  it("checks filter options according to filter prop passed in", () => {
    const { container } = render(
      <BlogFilter
        filter={{
          areas: ["Walsall"],
          categories: ["Category1"],
          dates: "updatedLastMonth",
        }}
        blogCategories={["Category1", "Category2", "Category3"]}
      />
    );

    const filters = container.getElementsByClassName(
      "wmcads-accordion__content"
    );

    const optionsAreas = getAllByRole(filters[0], "checkbox");
    expect(optionsAreas[0].getAttributeNames()).not.toContain("checked");
    expect(optionsAreas[1].getAttributeNames()).not.toContain("checked");
    expect(optionsAreas[2].getAttributeNames()).not.toContain("checked");
    expect(optionsAreas[3].getAttributeNames()).not.toContain("checked");
    expect(optionsAreas[4].getAttributeNames()).not.toContain("checked");
    expect(optionsAreas[5].getAttributeNames()).toContain("checked");
    expect(optionsAreas[6].getAttributeNames()).not.toContain("checked");
    expect(optionsAreas[7].getAttributeNames()).not.toContain("checked");

    const optionsCategories = getAllByRole(filters[1], "checkbox");
    expect(optionsCategories[0].getAttributeNames()).toContain("checked");
    expect(optionsCategories[1].getAttributeNames()).not.toContain("checked");
    expect(optionsCategories[2].getAttributeNames()).not.toContain("checked");

    const optionsDates = getAllByRole(filters[2], "radio");
    expect(optionsDates[0].getAttributeNames()).not.toContain("checked");
    expect(optionsDates[1].getAttributeNames()).toContain("checked");
    expect(optionsDates[2].getAttributeNames()).not.toContain("checked");
  });

  it("on changing a filter the filter change callback is invoked", () => {
    const mockSetFilter = jest.fn();
    const { container } = render(<BlogFilter setFilter={mockSetFilter} />);

    const filters = container.getElementsByClassName(
      "wmcads-accordion__content"
    );

    const optionsAreas = getAllByRole(filters[0], "checkbox");

    fireEvent.click(optionsAreas[2]);

    expect(mockSetFilter).toBeCalledWith({
      areas: ["Dudley"],
      categories: [],
      dates: undefined,
    });
  });

  it(
    "clicking to clear the filter will invoke filter change call back " +
      "with values to clear filter",
    () => {
      const mockSetFilter = jest.fn();
      render(
        <BlogFilter
          setFilter={mockSetFilter}
          filter={{
            areas: ["Sandwell"],
            categories: ["Category3"],
            dates: "updatedLastYear",
          }}
        />
      );

      const clearLink = screen.getByText("Clear all filters");

      fireEvent.click(clearLink);

      expect(mockSetFilter).toBeCalledWith({
        areas: [],
        categories: [],
        dates: undefined,
      });
    }
  );
});
