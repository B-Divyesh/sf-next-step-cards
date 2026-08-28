const heading = document.querySelector<HTMLElement>('h1');
const announcer = document.querySelector<HTMLElement>('#route-announcer');

if (heading) {
  requestAnimationFrame(() => {
    heading.focus({ preventScroll: true });
    if (announcer) announcer.textContent = `${document.title} loaded`;
  });
}
