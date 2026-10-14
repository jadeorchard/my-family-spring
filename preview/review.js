(() => {
  const root = document.getElementById('fs-concepts');
  const designSelect = document.getElementById('review-design');
  const viewSelect = document.getElementById('review-view');
  const isThankYou = location.pathname.replace(/\/+$/, '') === '/thank-you';
  const pageName = isThankYou ? 'Thank-You Preview' : 'Landing Page Preview';
  const allowedDesigns = ['practical', 'warm'];
  let design = 'practical';
  let mobile = false;

  function pathFor(path) {
    const query = new URLSearchParams({design});
    if (mobile) query.set('view', 'mobile');
    return path + '?' + query.toString();
  }

  function render() {
    const query = new URLSearchParams(location.search);
    design = allowedDesigns.includes(query.get('design')) ? query.get('design') : 'practical';
    mobile = query.get('view') === 'mobile';
    designSelect.value = design;
    viewSelect.value = mobile ? 'mobile' : 'responsive';
    root.classList.toggle('mobile-preview', mobile);
    root.querySelectorAll('[data-design]').forEach(stage => {
      stage.hidden = stage.dataset.design !== design;
      stage.querySelector('.fs-landing').hidden = isThankYou;
      stage.querySelector('.fs-confirmation').hidden = !isThankYou;
    });
    document.querySelectorAll('[data-review-path]').forEach(link => {
      link.href = pathFor(link.dataset.reviewPath);
      const active = (link.dataset.reviewPath === '/thank-you/') === isThankYou;
      if (link.closest('.review-tabs')) {
        if (active) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      }
    });
    const designName = design === 'warm' ? 'Warm & Personal' : 'Clear & Practical';
    document.title = `Family Spring | ${designName} | ${pageName}`;
  }

  function update(key, value) {
    const url = new URL(location.href);
    if (value === 'responsive') url.searchParams.delete(key);
    else url.searchParams.set(key, value);
    history.replaceState(null, '', url.pathname + url.search);
    render();
  }

  designSelect.addEventListener('change', () => update('design', designSelect.value));
  viewSelect.addEventListener('change', () => update('view', viewSelect.value));
  window.addEventListener('popstate', render);
  root.querySelectorAll('[data-to-form]').forEach(button => {
    button.addEventListener('click', () => {
      const form = root.querySelector(`[data-design="${design}"] .fs-intake`);
      form.scrollIntoView({block:'start', behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
      form.querySelector('[data-review-path]').focus({preventScroll:true});
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
  render();
})();
