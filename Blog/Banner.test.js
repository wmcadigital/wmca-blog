import { render } from "@testing-library/react";

import Banner from "./Banner";

describe("Banner", () => {
  it("wraps children that are passed in", () => {
    const { container } = render(<Banner>Some banner text</Banner>);

    const bannerContent = container.getElementsByClassName(
      "wmcads-banner-container__text"
    )[0];
    expect(bannerContent.innerHTML).toEqual("Some banner text");
  });

  it("displays a label if passed in", () => {
    const { container } = render(
      <Banner label="BANNER">Some banner text</Banner>
    );

    const bannerLabel = container.getElementsByClassName(
      "wmcads-phase-indicator"
    )[0];
    expect(bannerLabel.innerHTML).toEqual("BANNER");
  });
});
