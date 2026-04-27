// Client wrapper that calls server-side stub
export default async function getData() {
  const r = await fetch('/api/getData');
  if (!r.ok) return {};
  return r.json();
}
