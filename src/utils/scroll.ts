/**
 * Executes a function while preserving the scroll position of an element.
 * If the container was scrolled to the bottom, maintains bottom scroll after fn execution;
 * otherwise restores previous scroll position.
 * @param container - The scrollable HTML element.
 * @param fn - The function to execute while preserving scroll.
 */
export function preserveScroll(container: HTMLElement, fn: () => void) {
  const { scrollTop, scrollHeight } = container;
  const atBottom = scrollTop + container.clientHeight >= scrollHeight - 5;
  fn();
  if (atBottom) {
    container.scrollTop = container.scrollHeight;
  } else {
    container.scrollTop = scrollTop;
  }
}
