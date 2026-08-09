const listeners = new Set();
let pendingCount = 0;

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notify() {
  listeners.forEach((fn) => fn(pendingCount));
}

export function startRequest() {
  pendingCount++;
  notify();
}

export function endRequest() {
  pendingCount = Math.max(0, pendingCount - 1);
  notify();
}