import getData from "./getData";

describe("getData", () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ data: "test" }),
    })
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("calls fetch with the blog url", async () => {
    await getData();

    expect(fetch).toBeCalledWith(
      "https://app-umbraco-multisite.azurewebsites.net/umbraco/delivery/api/v1/content?filter=contentType%3AblogArticle&sort=name%3Aasc&skip=0&take=10"
    );
  });

  it("returns parsed data from the endpoint", async () => {
    const response = await getData();

    expect(response).toEqual({ data: "test" });
  });
});
