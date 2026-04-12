/**
 * Performance optimization utilities
 * - Throttle: Limit function calls to max frequency
 * - Debounce: Delay function call until after user stops action
 * - RequestAnimationFrame: Use RAF for smooth updates
 */

/**
 * Throttle function to limit calls
 * @param func Function to throttle
 * @param limit Time limit in milliseconds
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Debounce function to delay calls
 * @param func Function to debounce
 * @param delay Time delay in milliseconds
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * RequestAnimationFrame based throttle (for smooth animations)
 * @param func Function to throttle
 */
export function rafThrottle<T extends (...args: any[]) => any>(
  func: T,
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;
  return function (this: any, ...args: Parameters<T>) {
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        func.apply(this, args);
        rafId = null;
      });
    }
  };
}

/**
 * Check if element is in viewport using IntersectionObserver
 */
export function createIntersectionObserver(
  callback: (isInView: boolean) => void,
  options?: IntersectionObserverInit,
): IntersectionObserver {
  return new IntersectionObserver(
    ([entry]) => {
      callback(entry.isIntersecting);
    },
    {
      threshold: 0.1,
      ...options,
    },
  );
}

/**
 * Memoize a function result (simple version)
 */
export function memoize<T extends (...args: any[]) => any>(func: T): T {
  const cache = new Map();
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
}
