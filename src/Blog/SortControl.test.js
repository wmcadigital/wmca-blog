import { render, screen, fireEvent } from "@testing-library/react";

import SortControl from "./SortControl";

describe("SortControl", () => {
  it("displays three options including a default", () => {
    render(<SortControl />);

    const renderedOptions = screen.getAllByRole("option");

    expect(renderedOptions.length).toBe(3);
    expect(renderedOptions[0].getAttribute("value")).toEqual("");
    expect(renderedOptions[0].innerHTML).toEqual("Choose from list");
    expect(renderedOptions[1].getAttribute("value")).toEqual("descending");
    expect(renderedOptions[1].innerHTML).toEqual("Most recent");
    expect(renderedOptions[2].getAttribute("value")).toEqual("ascending");
    expect(renderedOptions[2].innerHTML).toEqual("Oldest");
  });

  it("on selecting a value it invokes the callback function with that value", () => {
    const mockChangedCallback = jest.fn();

    render(<SortControl sortChangedCallback={mockChangedCallback} />);

    const dropdown = screen.getByRole("combobox");

    fireEvent.change(dropdown, { target: { value: "ascending" } });

    expect(mockChangedCallback).toBeCalledWith("ascending");
  });
});
