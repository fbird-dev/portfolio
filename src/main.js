import './style.css';

const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const mobile = window.matchMedia('(max-width: 47.99rem)');

function setOpen(open) {
  toggle.setAttribute('aria-expanded', String(open));
  navigation.hidden = mobile.matches && !open;
}

function syncMenu() {
  toggle.hidden = !mobile.matches;
  setOpen(false);
}

toggle.addEventListener('click', () => {
  setOpen(toggle.getAttribute('aria-expanded') !== 'true');
});

navigation.addEventListener('click', (event) => {
  if (event.target.closest('a') && mobile.matches) setOpen(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && mobile.matches && toggle.getAttribute('aria-expanded') === 'true') {
    setOpen(false);
    toggle.focus();
  }
});

mobile.addEventListener('change', syncMenu);
syncMenu();

// Les liens restent des accès directs aux WebP sans prise en charge de dialog.
const dialog = document.querySelector('.image-dialog');
const galleryLinks = [...document.querySelectorAll('[data-gallery]')];

if (dialog && typeof dialog.showModal === 'function' && galleryLinks.length) {
  const image = document.createElement('img');
  image.className = 'dialog-image';
  const title = dialog.querySelector('#dialog-title');
  const caption = dialog.querySelector('#dialog-caption');
  const counter = dialog.querySelector('[data-counter]');
  const original = dialog.querySelector('[data-original]');
  let current = 0;
  let trigger;

  function display(index) {
    current = (index + galleryLinks.length) % galleryLinks.length;
    const link = galleryLinks[current];
    const source = link.querySelector('img');
    const figure = link.closest('figure');
    image.src = link.href;
    image.alt = source.alt;
    image.width = Number(source.getAttribute('width'));
    image.height = Number(source.getAttribute('height'));
    if (!image.isConnected) dialog.querySelector('figure').prepend(image);
    title.textContent = figure.querySelector('h3').textContent;
    caption.textContent = figure.querySelector('figcaption p').textContent;
    counter.textContent = `${current + 1} / ${galleryLinks.length}`;
    original.href = link.href;
  }

  galleryLinks.forEach((link, index) => {
    link.addEventListener('click', (event) => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      trigger = link;
      display(index);
      setOpen(false);
      dialog.showModal();
      document.documentElement.classList.add('gallery-open');
    });
  });

  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-previous]').addEventListener('click', () => display(current - 1));
  dialog.querySelector('[data-next]').addEventListener('click', () => display(current + 1));
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      display(current + (event.key === 'ArrowLeft' ? -1 : 1));
    }
    if (event.key === 'Tab') {
      const controls = [...dialog.querySelectorAll('button, a[href]')];
      const first = controls[0];
      const last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('gallery-open');
    trigger?.focus();
  });
}
