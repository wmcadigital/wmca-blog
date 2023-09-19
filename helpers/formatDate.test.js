import formatDate from "./formatDate";

describe("formatDate", () => {
  it("formats the passed in date for display", () => {
    expect(formatDate("2018-08-23T09:39:26")).toEqual(
      "Thursday 23 August 2018"
    );
  });
});
