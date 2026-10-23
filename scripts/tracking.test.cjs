const {test} = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const {join} = require('node:path');
const vm = require('node:vm');
const source = readFileSync(join(__dirname, '../preview/tracking.js'), 'utf8');

function setup() {
  const listeners = [];
  const scripts = [];
  const frame = {contentWindow:{}};
  const window = {addEventListener:(name, callback) => listeners.push(callback)};
  const document = {
    querySelector:() => frame,
    getElementById:id => scripts.find(script => script.id === id),
    createElement:() => ({}),
    head:{appendChild:script => scripts.push(script)},
  };
  const context = vm.createContext({window, document, location:{search:''}, URLSearchParams, console});
  const run = () => vm.runInContext(source, context);
  run();
  const send = (data, overrides = {}) => listeners.forEach(callback => callback({
    origin:'https://ccgw.oncehub.com', source:frame.contentWindow, data, ...overrides,
  }));
  const events = () => JSON.parse(JSON.stringify(window.dataLayer.filter(item => item.event.startsWith('oncehub.'))));
  return {window, scripts, listeners, frame, send, events, run};
}

test('loads one container and installs one listener even when initialized twice', () => {
  const app = setup(); app.run();
  assert.equal(app.scripts.length, 1);
  assert.equal(app.listeners.length, 1);
  assert.equal(app.scripts[0].src, 'https://www.googletagmanager.com/gtm.js?id=GTM-5RFN8RBW');
  assert.equal(app.window.dataLayer.filter(item => item.event === 'gtm.js').length, 1);
});

test('forwards only the two approved names, once each, without reading payload', () => {
  const app = setup();
  for (const type of ['oncehub.form.started','oncehub.form.completed']) {
    const data = {type, get payload() {throw new Error('Payload must not be read');}};
    app.send(data); app.send(data);
  }
  assert.deepEqual(app.events(), [{event:'oncehub.form.started'},{event:'oncehub.form.completed'}]);
});

test('ignores untrusted origins and frames, malformed data, and all other events', () => {
  const app = setup();
  app.send({type:'oncehub.form.completed'}, {origin:'https://ccgw.oncehub.com.attacker.example'});
  app.send({type:'oncehub.form.completed'}, {source:{}});
  app.send(null); app.send('oncehub.form.completed'); app.send({});
  app.send({type:'oncehub.form.button_clicked',payload:{answer:'synthetic test value'}});
  app.send({type:'oncehub.form.loaded'});
  assert.deepEqual(app.events(), []);
  app.send({type:'oncehub.form.completed'});
  assert.deepEqual(app.events(), [{event:'oncehub.form.completed'}]);
});

test('only the landing page loads tracking; confirmation preview cannot fire a page-view lead', () => {
  const landing = readFileSync(join(__dirname, '../preview/index.html'), 'utf8');
  const thanks = readFileSync(join(__dirname, '../preview/thank-you/index.html'), 'utf8');
  assert.equal((landing.match(/src="\/tracking\.js"/g) || []).length, 1);
  assert.ok(!thanks.includes('/tracking.js'));
  assert.ok(!thanks.includes('googletagmanager.com'));
  assert.ok(!landing.includes('review-design'));
  assert.ok(!landing.includes('fs-warm'));
});
