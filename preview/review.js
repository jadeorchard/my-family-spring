(() => {
  const root = document.getElementById('fs-concepts');
  root.querySelectorAll('[data-to-form]').forEach(button => {
    button.addEventListener('click', () => {
      const form = root.querySelector('.fs-intake');
      if (!form) return;
      form.scrollIntoView({block:'start', behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
      const target = form.querySelector('iframe') || form.querySelector('[data-intake-embed]');
      target.focus({preventScroll:true});
    });
  });
  root.querySelectorAll('[data-privacy]').forEach(button => {
    button.setAttribute('aria-expanded', 'false');
    button.addEventListener('click', () => {
      const notice = button.closest('.fs-page').querySelector('.fs-privacy');
      notice.hidden = !notice.hidden;
      button.setAttribute('aria-expanded', String(!notice.hidden));
    });
  });
})();
