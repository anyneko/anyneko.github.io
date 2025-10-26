// json-pick.js
export async function pickJson(url="https://fxrate-worker.aneko.workers.dev/?currency="+encodeURIComponent(currency)+"&bank="+encodeURIComponent(bank), path /* ['items', 0, 'title'] */) {
  const res = await fetch(url);
  const data = await res.json();
  return path.reduce((o, k) => o[k], data);
}

export async function pickJsonPost(currency,bank,body, path) {
  const res = await fetch("https://fxrate-worker.aneko.workers.dev/?currency="+encodeURIComponent(currency)+"&bank="+encodeURIComponent(bank), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return path.reduce((o, k) => o[k], data);
}
