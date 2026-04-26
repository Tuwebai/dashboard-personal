export function scheduleAfterPaint(callback: () => void) {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  let innerFrame = 0;
  const frame = window.requestAnimationFrame(() => {
    innerFrame = window.requestAnimationFrame(callback);
  });

  return () => {
    window.cancelAnimationFrame(frame);
    if (innerFrame) {
      window.cancelAnimationFrame(innerFrame);
    }
  };
}
