import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [html, app] = await Promise.all([
  readFile(new URL('./index.html', import.meta.url), 'utf8'),
  readFile(new URL('./app.mjs', import.meta.url), 'utf8')
]);

const htmlVersion = getMatch(html, /HTML v([0-9]+\.[0-9]+\.[0-9]+)/, 'HTML version');
const jsVersion = getMatch(app, /APP_JS_VERSION = '([0-9]+\.[0-9]+\.[0-9]+)'/, 'JavaScript version');

assert.equal(getMatch(html, /styles\.css\?v=([^"']+)/, 'stylesheet token'), htmlVersion);
assert.equal(getMatch(html, /app\.mjs\?v=([^"']+)/, 'app token'), jsVersion);
assert.equal(getMatch(app, /parser-core\.mjs\?v=([^"']+)/, 'parser token'), jsVersion);
assert.equal(getMatch(app, /csv-export\.mjs\?v=([^"']+)/, 'CSV token'), jsVersion);

console.log('App version token tests passed');

function getMatch(content, pattern, label) {
  const match = content.match(pattern);
  assert.ok(match, `${label} is missing`);
  return match[1];
}
