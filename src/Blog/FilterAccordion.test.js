import { render, screen, fireEvent } from "@testing-library/react";

import FilterAccordion from "./FilterAccordion";

const mockOptions = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" },
  { label: "Option 4", value: "option4" },
  { label: "Option 5", value: "option5" },
];

describe("FilterAccordion", () => {
  it("renders a list of checkbox options", () => {
    render(<FilterAccordion title="Options" options={mockOptions} />);

    const accordionHeading = screen.getByRole("heading");
    const options = screen.getAllByRole("checkbox");

    expect(accordionHeading.innerHTML).toEqual("Options");
    expect(options.length).toBe(5);

    expect(options[0].getAttribute("value")).toEqual("option1");
    expect(options[1].getAttribute("value")).toEqual("option2");
    expect(options[2].getAttribute("value")).toEqual("option3");
    expect(options[3].getAttribute("value")).toEqual("option4");
    expect(options[4].getAttribute("value")).toEqual("option5");
  });

  it("renders a list of radio options", () => {
    render(<FilterAccordion title="Options" options={mockOptions} selectOne />);

    const accordionHeading = screen.getByRole("heading");
    const options = screen.getAllByRole("radio");

    expect(accordionHeading.innerHTML).toEqual("Options");
    expect(options.length).toBe(5);

    expect(options[0].getAttribute("value")).toEqual("option1");
    expect(options[1].getAttribute("value")).toEqual("option2");
    expect(options[2].getAttribute("value")).toEqual("option3");
    expect(options[3].getAttribute("value")).toEqual("option4");
    expect(options[4].getAttribute("value")).toEqual("option5");
  });

  it("clicking on an option will invoke a callback", () => {
    const mockOptionSelected = jest.fn();
    render(
      <FilterAccordion
        title="Options"
        options={mockOptions}
        optionSelected={mockOptionSelected}
      />
    );

    const options = screen.getAllByRole("checkbox");

    fireEvent.click(options[0]);

    expect(mockOptionSelected).toBeCalledWith("option1");
  });

  it("relevant option is checked depending on result of optionSelectedFn", () => {
    const mockOptionSelectedFn = (value) =>
      value === "option3" ? true : false;
    render(
      <FilterAccordion
        title="Options"
        options={mockOptions}
        optionSelectedFn={mockOptionSelectedFn}
      />
    );

    const options = screen.getAllByRole("checkbox");

    expect(options[0].getAttributeNames()).not.toContain("checked");
    expect(options[1].getAttributeNames()).not.toContain("checked");
    expect(options[2].getAttributeNames()).toContain("checked");
    expect(options[3].getAttributeNames()).not.toContain("checked");
    expect(options[4].getAttributeNames()).not.toContain("checked");
  });

  it("contents in accordion can be show or hidden by clicking expand/hide button", () => {
    const { container } = render(
      <FilterAccordion title="Options" options={mockOptions} />
    );

    const hideShowBtn = screen.getByRole("button");

    expect(container.getElementsByClassName("wmcads-is--open").length).toBe(1);

    fireEvent.click(hideShowBtn);

    expect(container.getElementsByClassName("wmcads-is--open").length).toBe(0);

    fireEvent.click(hideShowBtn);

    expect(container.getElementsByClassName("wmcads-is--open").length).toBe(1);
  });
});
