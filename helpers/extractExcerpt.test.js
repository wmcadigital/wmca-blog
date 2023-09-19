import extractExcerpt from "./extractExcerpt";

const htmlText =
  '<p><span>A dedicated website providing the latest information for West Midlands businesses hit by the Covid-19 crisis was launched today (Wednesday March 25) by the West Midlands Combined Authority (WMCA).</span></p>\r\n<p><span>The site provides a bespoke resource for businesses seeking up-to-date advice on how to deal with the pandemic as well as what financial support is available and how to access it.</span></p>\r\n<p><span>The </span><a href="https://beta.wmca.org.uk/what-we-do/covid-19-support/business-support/"><span>Covid-19 Business Support </span></a><span> site is a response to feedback from the region’s Covid-19 Economic Impact Group which was set up by Mayor of the West Midlands Andy Street and the WMCA.</span></p>';
const expectedOutput =
  "<span>A dedicated website providing the latest information for West Midlands businesses hit by the Covid-19 crisis was launched today (Wednesday March 25) by the West Midlands Combined Authority (WMCA).</span>...";

describe("extractExcerpt", () => {
  it("should extract and return the contents of the first paragraph", () => {
    expect(extractExcerpt(htmlText)).toEqual({ __html: expectedOutput });
  });
});
