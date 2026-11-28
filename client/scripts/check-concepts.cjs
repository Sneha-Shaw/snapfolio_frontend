/* Browser smoke test against the production build. Uses local Chrome/Edge and
 * synthetic API responses; never reads .env or touches the portfolio database.
 * Run: node client/scripts/check-concepts.cjs (after building the client).
 */
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const os = require('node:os');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');

const client = path.resolve(__dirname, '..');
assert.ok(fs.existsSync(path.join(client, 'dist/index.html')), 'Build the client before running concept checks.');
const browserPath = process.env.CONCEPT_TEST_BROWSER || [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/chromium', '/usr/bin/google-chrome',
].find(p => fs.existsSync(p));
if (!browserPath) throw new Error('Set CONCEPT_TEST_BROWSER to a local Chrome/Chromium/Edge executable.');
const presets = [...fs.readFileSync(path.join(client, 'src/components/sections/presets.ts'), 'utf8').matchAll(/\{\s+id: '([^']+)',\s+name:[\s\S]*?\n  \},/g)]
  .filter(m => m[0].includes('concept:')).map(m => ({ id: m[1], theme: m[0].match(/theme: '([^']+)'/)[1] }));
const image = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="800" height="600" fill="#183f42"/><circle cx="500" cy="220" r="180" fill="#42776a"/><path d="M0 600L300 200 650 600" fill="#94b8a0"/></svg>');
const technologies = ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Docker', 'Python', 'Next.js', 'Git', 'Redis', 'Vite', 'GraphQL', 'PostgreSQL'].map((name, i) => ({
  _id: `tech-${i}`, name, slug: name.toLowerCase().replace('.', ''), icon: '', category: ['frontend', 'backend', 'database', 'devops'][i % 4], documentationUrl: 'https://example.com/docs', enabled: true, displayOrder: i,
}));
const profile = { name: 'Alex Morgan', headline: 'Thoughtful software, made with care.', heroStatement: 'Ideas take shape.\nGood work takes root.', bio: 'I build useful digital experiences for people.', aboutText: 'I am a developer who connects thoughtful design with reliable engineering.\nFrom first sketches to the final details, I enjoy making complex things feel simple.', heroEyebrow: 'Independent developer', heroCurrently: 'Building for the web', heroTimezone: 'Asia/Calcutta', email: 'alex@example.com', location: 'Kolkata, India', availability: 'Open to collaborations', profileImage: { url: image }, focusAreas: ['Web applications', 'Design systems', 'Developer tools'], services: [{ title: 'Product engineering', description: 'Useful products, from the first prototype through production.' }, { title: 'Interface design', description: 'Careful typography and accessible interactions.' }, { title: 'Creative development', description: 'Expressive websites that make an impression.' }], testimonials: [{ name: 'Taylor', role: 'Designer', company: 'Studio', quote: 'A thoughtful collaborator who brings clarity and care to every detail.' }], layout: [], template: 'woodland' };
const projects = Array.from({ length: 4 }, (_, i) => ({ _id: `project-${i}`, title: ['Field Notes', 'Tidal Studio', 'Atlas Workspace', 'Common Ground'][i], slug: `project-${i}`, shortDescription: 'An independent digital experience built for curious people.', description: 'A detailed case study.', thumbnail: { url: image }, images: [{ url: image }], year: 2025 + i % 2, role: 'Design & development', featured: true, technologies, published: true }));
const experiences = Array.from({ length: 3 }, (_, i) => ({ _id: `experience-${i}`, position: 'Software engineer', company: ['Independent', 'Studio North', 'Acme'][i], startDate: `${2024-i*2}-01-01`, endDate: `${2025-i*2}-01-01`, current: i === 0, responsibilities: ['Built accessible experiences for thousands of people.', 'Worked across design and engineering.'], technologies: technologies.slice(0, 3), description: 'Product and platform development.' }));
const education = [{ _id: 'education-1', degree: 'Computer Science', institution: 'University', field: 'Software engineering', startDate: '2016-01-01', endDate: '2020-01-01', description: 'A foundation in algorithms and systems.' }];
const responses = { profile, projects, technologies, experience: experiences, education, 'social-links': [{ _id: 'social-1', platform: 'GitHub', label: 'GitHub', url: 'https://github.com/example' }] };
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const relative = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
  let file = path.resolve(client, 'dist', relative);
  if (!file.startsWith(path.join(client, 'dist') + path.sep)) { res.writeHead(403).end(); return; }
  if (!fs.existsSync(file)) file = path.join(client, 'dist/index.html');
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).on('error', () => res.writeHead(503).end('Build unavailable')).pipe(res);
});

let browser;
const temporaryProfile = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-concepts-'));
const pending = new Map();
let nextId = 0;
let incoming = '';
const errors = [];
const layoutFailures = [];
let session;
function cdp(method, params = {}, sessionId = session) {
  return new Promise((resolve, reject) => {
    const id = ++nextId;
    const timer = setTimeout(() => { pending.delete(id); reject(new Error(`CDP timeout: ${method}`)); }, 20000);
    pending.set(id, { resolve, reject, timer });
    browser.stdio[3].write(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }) + '\0');
  });
}
async function evaluate(expression) {
  const result = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
async function until(expression) {
  for (let i = 0; i < 120; i++) {
    if (await evaluate(expression)) return;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error(`Timed out: ${expression}`);
}
async function navigate(url) {
  await cdp('Page.navigate', { url });
  await until(`location.href === ${JSON.stringify(url)} && document.querySelector('.section-viewport section') && document.body.innerText.includes('Alex')`);
  const initial = await evaluate(`({mounted: document.querySelectorAll('.section-viewport[data-mounted="true"]').length, total: document.querySelectorAll('.section-viewport').length})`);
  assert.ok(initial.mounted < initial.total, 'Offscreen sections should not all mount on initial navigation');
  // Walk the page as a visitor would; wait for each deferred design to load.
  for (let index = 0; index < initial.total; index++) {
    await evaluate(`document.querySelectorAll('.section-viewport')[${index}].scrollIntoView({behavior: 'instant'})`);
    await until(`(() => { const e = document.querySelectorAll('.section-viewport')[${index}]; return e.dataset.mounted === 'true' && !e.querySelector('.section-placeholder'); })()`);
    const overflow = await evaluate(`document.documentElement.scrollWidth > innerWidth + 1`);
    if (overflow) layoutFailures.push(`Horizontal overflow in section ${index} of ${url}`);
  }
  await evaluate(`window.scrollTo({top: 0, behavior: 'instant'})`);
}

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  browser = spawn(browserPath, ['--headless=new', '--remote-debugging-pipe', '--no-first-run', '--disable-gpu', `--user-data-dir=${temporaryProfile}`], { stdio: ['ignore', 'ignore', 'ignore', 'pipe', 'pipe'], windowsHide: true });
  browser.stdio[4].on('data', data => {
    incoming += data.toString();
    let end;
    while ((end = incoming.indexOf('\0')) >= 0) {
      const message = JSON.parse(incoming.slice(0, end)); incoming = incoming.slice(end + 1);
      if (message.id) {
        const p = pending.get(message.id); if (!p) continue;
        clearTimeout(p.timer); pending.delete(message.id);
        if (message.error) p.reject(new Error(JSON.stringify(message.error))); else p.resolve(message.result);
      } else if (message.method === 'Fetch.requestPaused') {
        const request = message.params;
        const key = new URL(request.request.url).pathname.replace(/^.*\/api\//, '').split('/')[0];
        cdp('Fetch.fulfillRequest', { requestId: request.requestId, responseCode: key === 'auth' ? 401 : 200, responseHeaders: [{ name: 'Content-Type', value: 'application/json' }, { name: 'Access-Control-Allow-Origin', value: origin }, { name: 'Access-Control-Allow-Credentials', value: 'true' }], body: Buffer.from(JSON.stringify({ success: key !== 'auth', data: responses[key] ?? null })).toString('base64') }).catch(e => errors.push(e.message));
      } else if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text + ': ' + message.params.exceptionDetails.exception?.description);
    }
  });
  const target = await cdp('Target.createTarget', { url: 'about:blank' }, null);
  session = (await cdp('Target.attachToTarget', { targetId: target.targetId, flatten: true }, null)).sessionId;
  await cdp('Page.enable'); await cdp('Runtime.enable');
  await cdp('Fetch.enable', { patterns: [{ urlPattern: '*/api/*' }] });
  await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  assert.equal(presets.length, 28);
  for (const width of [1440, 390]) {
    await cdp('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: false });
    for (const preset of presets) {
      await navigate(`${origin}/?template=${preset.id}&theme=${preset.theme}`);
      const result = await evaluate(`(() => ({ overflow: document.documentElement.scrollWidth > innerWidth + 1, scenes: document.querySelectorAll('.concept-scene').length, clipped: [...document.querySelectorAll('.cs-copy')].filter(e => e.scrollWidth > e.clientWidth + 2).length, links: document.querySelectorAll('a[href="/work/project-0"]').length, skills: document.querySelector('#skills')?.textContent, motion: [...document.querySelectorAll('.concept-scene')].every(e => e.dataset.motion === 'paused') }))()`);
      if (result.overflow) console.log(await evaluate(`JSON.stringify([...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(); return r.right > innerWidth + 2 && getComputedStyle(e).position !== 'absolute'; }).slice(0, 12).map(e => ({ tag: e.tagName, class: e.className, width: e.getBoundingClientRect().width, text: e.textContent.slice(0, 80) })))`));
      if (result.overflow) layoutFailures.push(`${preset.id} at ${width}px: horizontal overflow`);
      if (result.clipped) layoutFailures.push(`${preset.id} at ${width}px: ${result.clipped} clipped text blocks`);
      assert.ok(result.links, `${preset.id}: project links missing`);
      assert.ok(result.skills.includes('React'), `${preset.id}: technology data missing`);
      assert.ok(result.motion, `${preset.id}: reduced motion not respected`);
      const headingSize = await evaluate(`Math.max(0, ...[...document.querySelectorAll('.cs-heading h2')].map(e => parseFloat(getComputedStyle(e).fontSize)))`);
      assert.ok(headingSize <= 32, `${preset.id}: section heading too large (${headingSize}px)`);
    }
    console.log(`Checked all 28 concept presets at ${width}px; content, project links, overflow and reduced motion.`);
  }
  assert.deepEqual(layoutFailures, [], 'Responsive layout failures');
  await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
  await navigate(`${origin}/?template=abyss&theme=abyss`);
  await evaluate(`document.querySelector('#skills').scrollIntoView()`);
  await until(`document.querySelector('#skills').dataset.motion === 'running'`);
  await evaluate(`document.querySelector('#skills button').click()`);
  await until(`document.querySelector('#skills').dataset.motion === 'paused'`);
  assert.equal(await evaluate(`document.querySelector('#skills button').getAttribute('aria-pressed')`), 'true');
  await evaluate(`document.querySelector('#skills button').click()`);
  await until(`document.querySelector('#skills').dataset.motion === 'running'`);
  console.log('PASS: rising bubbles pause/resume control.');
  await evaluate(`window.scrollTo({top: 0, behavior: 'instant'})`);
  await until(`document.querySelector('#skills').closest('.section-viewport').dataset.active === 'false'`);
  assert.equal(await evaluate(`getComputedStyle(document.querySelector('#skills .cs-item')).animationPlayState`), 'paused');
  console.log('PASS: offscreen animations pause; all concept pages defer initial section mounting.');
  const loadedFamilies = await evaluate(`performance.getEntriesByType('resource').map(e => e.name).filter(n => /\\/(modern|premium|makers|science|analog|weather|macbook|nature|objects)-/.test(n))`);
  assert.deepEqual(loadedFamilies, [], 'Sea concept should not download unrelated design implementations');
  console.log('PASS: unrelated design families are not downloaded on the sea page.');
  responses.technologies = Array.from({ length: 24 }, (_, i) => ({ ...technologies[i % technologies.length], _id: `expanded-${i}` }));
  await navigate(`${origin}/?template=woodland&theme=woodland`);
  await evaluate(`document.querySelector('#skills').scrollIntoView({behavior: 'instant'})`);
  assert.equal(await evaluate(`document.querySelectorAll('#skills .cs-item').length`), 12);
  await evaluate(`document.querySelector('#skills .cs-show-more').click()`);
  await until(`document.querySelectorAll('#skills .cs-item').length === 24`);
  await evaluate(`document.querySelector('#skills .cs-show-more').click()`);
  await until(`document.querySelectorAll('#skills .cs-item').length === 12`);
  responses.technologies = technologies;
  console.log('PASS: compact technology lists expand and collapse without losing content.');
  assert.deepEqual(errors, [], 'Browser runtime errors');
  if (process.env.CONCEPT_SCREENSHOTS) {
    const folder = path.resolve(process.env.CONCEPT_SCREENSHOTS); fs.mkdirSync(folder, { recursive: true });
    for (const motif of ['abyss', 'woodland', 'bindery', 'shortwave']) {
      await cdp('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
      await navigate(`${origin}/?template=${motif}&theme=${motif}`);
      await evaluate(`document.querySelector('#${['abyss', 'woodland'].includes(motif) ? 'skills' : 'about'}').scrollIntoView()`);
      await new Promise(resolve => setTimeout(resolve, 500));
      const shot = await cdp('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(folder, `${motif}.png`), Buffer.from(shot.data, 'base64'));
    }
  }
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
  if (browser) { await cdp('Browser.close', {}, null).catch(() => {}); browser.kill(); }
  server.close();
  // Temporary browser data is left to OS temp cleanup; no existing profile is used.
});
