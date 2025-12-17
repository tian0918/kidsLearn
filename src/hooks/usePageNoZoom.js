import { onMounted, onBeforeUnmount } from 'vue';

export function usePageNoZoom() {
  const preventMultiTouch = (e) => {
    if (e.touches && e.touches.length > 1) {
      e.preventDefault();
    }
  };

  let lastTouchEnd = 0;
  const preventDoubleTap = (e) => {
    const now = Date.now();
    if (now - lastTouchEnd < 300) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  };

  onMounted(() => {
    document.addEventListener('touchstart', preventMultiTouch, {
      passive: false,
    });
    document.addEventListener('touchmove', preventMultiTouch, {
      passive: false,
    });
    document.addEventListener('touchend', preventDoubleTap, {
      passive: false,
    });
  });

  onBeforeUnmount(() => {
    document.removeEventListener('touchstart', preventMultiTouch);
    document.removeEventListener('touchmove', preventMultiTouch);
    document.removeEventListener('touchend', preventDoubleTap);
  });
}
