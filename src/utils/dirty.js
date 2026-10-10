// Minimale Meldestelle: storage.js meldet, welche Daten (owner + key) sich
// geändert haben; sync.js hört zu und schiebt sie zum Server.
// Eigenes Modul, damit storage.js und sync.js sich nicht gegenseitig importieren.

const listeners = new Set();

export function markDirty(owner, key) {
  if (!owner || !key) return;
  listeners.forEach((fn) => fn(owner, key));
}

export function onDirty(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
