import { render, screen } from "@testing-library/react";

import Link from "./Link";

describe("Link", () => {
  it("wraps children that are passed in", () => {
    render(<Link>Go Here</Link>);

    const aLink = screen.getByRole("link");
    expect(aLink.innerHTML).toEqual("Go Here");
  });

  it("renders a link with href and title if passed in", () => {
    render(
      <Link hrefLink="goHereLink" title="Hint">
        Go Here
      </Link>
    );

    const aLink = screen.getByRole("link");
    expect(aLink.getAttribute("href")).toEqual("goHereLink");
    expect(aLink.getAttribute("title")).toEqual("Hint");
  });
});
