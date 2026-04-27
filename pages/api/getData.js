// Lightweight server-side stub that mirrors the client helper used by tests.
export default async function handler(req, res) {
  res.status(200).json({});
}
