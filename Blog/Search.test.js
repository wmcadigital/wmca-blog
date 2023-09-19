import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Search from "./Search";

describe("Search", () => {
  it("displays Search Input control with optional placeholder", () => {
    render(<Search placeholder="Search Placeholder..." />);

    const searchInput = screen.getByRole("textbox");
    expect(searchInput.getAttribute("placeholder")).toEqual(
      "Search Placeholder..."
    );
  });

  it("invokes change callback when input value changes", async () => {
    const mockChangeCallback = jest.fn();

    render(
      <Search
        placeholder="Search Placeholder..."
        changeCallback={mockChangeCallback}
      />
    );

    const searchInput = screen.getByRole("textbox");
    await waitFor(() => userEvent.type(searchInput, "Some Text"));

    expect(mockChangeCallback).toBeCalledWith("Some Text");
  });

  it("invokes button clicked callback when button is clicked", () => {
    const mockButtonClickedCallback = jest.fn();

    render(<Search searchButtonClickedCallback={mockButtonClickedCallback} />);

    const searchButton = screen.getByRole("button");
    fireEvent.click(searchButton);

    expect(mockButtonClickedCallback).toBeCalledTimes(1);
  });
});
