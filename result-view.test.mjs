import assert from 'node:assert/strict';
import {
  getSearchableResultText,
  normalizeSearchText,
  sortResults
} from './result-view.mjs';

const sortableColumns = new Set(['gruppe']);
const regionTwo = { source_file: 'zwei.eml', status: 'ok', gruppe: 'Region 2' };
const withoutGroup = { source_file: 'leer.eml', status: 'ok', gruppe: '' };
const regionTen = { source_file: 'zehn.eml', status: 'ok', gruppe: 'Region 10' };
const results = [regionTen, withoutGroup, regionTwo];

assert.equal(getSearchableResultText(regionTwo).includes(normalizeSearchText('REGION 2')), true);
assert.equal(getSearchableResultText(withoutGroup).includes('undefined'), false);
assert.deepEqual(
  sortResults(results, { column: 'gruppe', direction: 'asc' }, sortableColumns),
  [withoutGroup, regionTwo, regionTen]
);
assert.deepEqual(
  sortResults(results, { column: 'gruppe', direction: 'desc' }, sortableColumns),
  [regionTen, regionTwo, withoutGroup]
);
assert.equal(sortResults(results, { column: '', direction: 'asc' }, sortableColumns), results);

console.log('Result view tests passed');
