import assert from 'node:assert/strict';
import {
  CSV_COLUMNS,
  CSV_MEDIA_TYPE,
  createCsvFilename,
  createResultsCsv,
  getSuccessfulResults,
  hasSuccessfulResults
} from './csv-export.mjs';

const successfulFirst = {
  source_file: 'alarm;eins.eml',
  status: 'ok',
  error: '',
  datum: '2026-09-07T08:30:00+02:00',
  einsatzstichwort: 'NFS "Akut"',
  ort: 'Berlin; Mitte',
  priority: 'nein',
  alarm_text: 'Erste Zeile\nZweite Zeile',
  einheit: '',
  gruppe: 'Region 1, Region 2, Region 3',
  verfasser: 'Müller'
};
const failed = {
  source_file: 'fehler.eml',
  status: 'error',
  error: 'Nicht exportieren'
};
const successfulSecond = {
  source_file: '=HYPERLINK("https://example.invalid")',
  status: 'ok',
  datum: '2026-09-07T09:00:00+02:00',
  einsatzstichwort: '\t+SUM(1;1)',
  ort: '  @remote',
  priority: '-1',
  alarm_text: 'Unauffällig',
  einheit: null,
  gruppe: undefined,
  verfasser: undefined
};

assert.deepEqual(getSuccessfulResults([successfulFirst, failed, successfulSecond]), [
  successfulFirst,
  successfulSecond
]);
assert.equal(hasSuccessfulResults([]), false);
assert.equal(hasSuccessfulResults([failed]), false);
assert.equal(hasSuccessfulResults([failed, successfulFirst]), true);
assert.equal(hasSuccessfulResults([]), false);
assert.deepEqual(CSV_COLUMNS, [
  'source_file',
  'datum',
  'einsatzstichwort',
  'ort',
  'priority',
  'alarm_text',
  'einheit',
  'gruppe',
  'verfasser'
]);

const csv = createResultsCsv([successfulFirst, failed, successfulSecond]);
const expected = [
  '\ufeff"source_file";"datum";"einsatzstichwort";"ort";"priority";"alarm_text";"einheit";"gruppe";"verfasser"',
  '"alarm;eins.eml";"2026-09-07T08:30:00+02:00";"NFS ""Akut""";"Berlin; Mitte";"nein";"Erste Zeile\r\nZweite Zeile";"";"Region 1, Region 2, Region 3";"Müller"',
  '"\'=HYPERLINK(""https://example.invalid"")";"2026-09-07T09:00:00+02:00";"\'\t+SUM(1;1)";"\'  @remote";"\'-1";"Unauffällig";"";"";""',
  ''
].join('\r\n');

assert.equal(csv, expected);
assert.equal(csv.startsWith('\ufeff'), true);
assert.equal(csv.includes('fehler.eml'), false);
assert.equal(csv.includes('Nicht exportieren'), false);
assert.equal(createResultsCsv([failed]), `${String.fromCodePoint(0xfeff)}"source_file";"datum";"einsatzstichwort";"ort";"priority";"alarm_text";"einheit";"gruppe";"verfasser"\r\n`);
assert.equal(CSV_MEDIA_TYPE, 'text/csv;charset=utf-8');
assert.equal(createCsvFilename(new Date(2026, 8, 7)), 'divera-alarme-2026-09-07.csv');

console.log('CSV export tests passed');
