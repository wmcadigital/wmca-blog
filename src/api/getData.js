// Lightweight helper used by tests; the tests mock this module so this file
// just returns a resolved promise to avoid runtime errors in non-mocked runs.
export default async function getData() {
  return Promise.resolve({});
}
