// Lightweight analytics wrapper to avoid importing heavy analytics lib in many components.
// Calls are queued until the real analytics (gtag / react-ga4) is available.
const _queue = [];

function _enqueue(fn) {
  _queue.push(fn);
}

export function send(payload) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    try {
      if (payload && payload.hitType === "pageview") {
        // Map to gtag page_view
        window.gtag("event", "page_view", {
          page_path: payload.page,
          page_title: payload.title,
        });
      } else if (payload && payload.event) {
        window.gtag("event", payload.event, payload);
      } else if (payload && payload.eventAction) {
        // fallback for ReactGA style
        window.gtag("event", payload.eventAction, payload);
      } else {
        // noop
      }
    } catch (e) {
      // swallow
      // console.debug('analytics send failed', e);
    }
  } else {
    _enqueue(() => send(payload));
  }
}

export function event(name, params) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", name, params || {});
  } else {
    _enqueue(() => event(name, params));
  }
}

export function flush() {
  while (_queue.length) {
    try {
      const fn = _queue.shift();
      fn();
    } catch (e) {
      // ignore
    }
  }
}

export default { send, event, flush };
