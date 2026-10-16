/* ═══════════════════════════════════════════════════
   M&M REALTY — Utilities
   Throttle, debounce, helpers
   ═══════════════════════════════════════════════════ */

/**
 * Throttle — limit function calls to once per interval
 * Used for scroll and resize handlers
 */
export function throttle(fn, delay = 100) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}

/**
 * Debounce — delay execution until input stops
 * Used for search inputs and resize end detection
 */
export function debounce(fn, delay = 250) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Select single element (shorthand)
 */
export function $(selector, parent = document) {
  return parent.querySelector(selector);
}

/**
 * Select all elements (shorthand)
 */
export function $$(selector, parent = document) {
  return [...parent.querySelectorAll(selector)];
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Animate counter from 0 to target
 * Used for Market Power Index stats
 */
/**
 * Format a number with commas and a fixed number of decimals
 * e.g. formatNumber(1732, 0) -> "1,732", formatNumber(3.43, 2) -> "3.43"
 */
export function formatNumber(value, decimals = 0) {
  return Number(value).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function animateCounter(element, target, duration = 2000, prefix = '', suffix = '') {
  // Keep as many decimals as the target has (3.43 -> 2, 5.6 -> 1, 1732 -> 0)
  const decimals = (String(target).split('.')[1] || '').length;

  if (prefersReducedMotion()) {
    element.textContent = prefix + formatNumber(target, decimals) + suffix;
    return;
  }

  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = formatNumber(eased * target, decimals);

    element.textContent = prefix + current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}
