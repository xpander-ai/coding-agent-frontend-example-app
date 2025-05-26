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
