import { resetPageScroll } from './lenis';

export function navigateToProduct(gemstoneId: string) {
  const target = `/#product/${encodeURIComponent(gemstoneId)}`;
  if (`${window.location.pathname}${window.location.hash}` !== target) {
    window.history.pushState(null, '', target);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
  resetPageScroll();
}

export function navigateToCheckout() {
  if (window.location.pathname !== '/checkout') {
    window.history.pushState(null, '', '/checkout');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
  resetPageScroll();
}

export function navigateToCart() {
  if (window.location.pathname !== '/cart') {
    window.history.pushState(null, '', '/cart');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
  resetPageScroll();
}
