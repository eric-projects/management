export function scrollCompatibility(container: HTMLElement, top: number): void {
  if (container && container.scrollTo) {
    container.scrollTo({
      top: top,
      behavior: 'smooth',
    });
  } else {
    container.scrollTop = top;
  }
}
