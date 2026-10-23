(() => {
  // This file is included only on the landing page, never the unconnected
  // thank-you preview: the shared GTM container counts /thank-you/ visits as leads.
  if (window.familySpringTrackingInitialized) return;
  window.familySpringTrackingInitialized = true;
  window.dataLayer = window.dataLayer || [];

  const allowedEvents = new Set(['oncehub.form.started', 'oncehub.form.completed']);
  const forwardedEvents = new Set();
  window.addEventListener('message', message => {
    const frame = document.querySelector('.fs-oncehub-form iframe');
    if (!frame || message.source !== frame.contentWindow ||
        message.origin !== 'https://ccgw.oncehub.com') return;
    if (!message.data || typeof message.data !== 'object') return;
    const event = message.data.type;
    if (!allowedEvents.has(event) || forwardedEvents.has(event)) return;
    forwardedEvents.add(event);
    // Deliberately never access/spread payload: it may contain intake answers.
    window.dataLayer.push({event});
    if (new URLSearchParams(location.search).get('tracking_debug') === '1') {
      console.info('Family Spring tracking:', event);
    }
  });

  if (!document.getElementById('fs-gtm')) {
    window.dataLayer.push({'gtm.start': Date.now(), event:'gtm.js'});
    const script = document.createElement('script');
    script.id = 'fs-gtm';
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-5RFN8RBW';
    document.head.appendChild(script);
  }
})();
