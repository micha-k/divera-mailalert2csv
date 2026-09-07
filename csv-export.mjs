export const CSV_COLUMNS = Object.freeze([
  'source_file',
  'datum',
  'einsatzstichwort',
  'ort',
  'priority',
  'alarm_text',
  'einheit',
  'verfasser'
]);

export const CSV_MEDIA_TYPE = 'text/csv;charset=utf-8';

const CSV_DELIMITER = ';';
const CSV_LINE_ENDING = '\r\n';
const UTF8_BOM = '\ufeff';
const FORMULA_PREFIX = /^[\u0000-\u0020]*[=+\-@]/;

export function getSuccessfulResults(results) {
  return Array.from(results || []).filter((result) => result?.status === 'ok');
}

export function hasSuccessfulResults(results) {
  return getSuccessfulResults(results).length > 0;
}

export function createResultsCsv(results) {
  const rows = [
    CSV_COLUMNS,
    ...getSuccessfulResults(results).map((result) => (
      CSV_COLUMNS.map((column) => result[column] ?? '')
    ))
  ];

  return `${UTF8_BOM}${rows.map(serializeRow).join(CSV_LINE_ENDING)}${CSV_LINE_ENDING}`;
}

export function createCsvFilename(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `divera-alarme-${year}-${month}-${day}.csv`;
}

function serializeRow(values) {
  return values.map(serializeField).join(CSV_DELIMITER);
}

function serializeField(value) {
  const normalized = String(value)
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n/g, CSV_LINE_ENDING);
  const safeValue = FORMULA_PREFIX.test(normalized) ? `'${normalized}` : normalized;

  return `"${safeValue.replace(/"/g, '""')}"`;
}
